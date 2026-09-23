<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateVisaDocumentsRequest;
use App\Http\Requests\UpdateVisaFieldsRequest;
use App\Models\Visa;
use App\Services\CountryService;
use App\Services\VisaDocumentService;
use App\Services\VisaFieldConfigService;
use App\Services\VisaRequirementsService;
use App\Services\VisaService;
use App\Services\VisaServiceCategoryService;
use App\Services\VisaTypeService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VisaController extends Controller
{
    public function __construct(
        protected VisaService $visaService,
        protected VisaTypeService $visaTypeService,
        protected CountryService $countryService,
        protected VisaServiceCategoryService $categoryService,
        protected VisaFieldConfigService $fieldConfigService,
        protected VisaDocumentService $documentService,
        protected VisaRequirementsService $requirementsService,
    ) {
    }

    public function index(Request $request)
    {
        $filters = [
            'status' => in_array($request->query('status'), ['active', 'inactive', 'all'], true)
                ? $request->query('status')
                : 'active',
            'search' => trim((string) $request->query('search', '')),
        ];

        $visas = $this->visaService->paginate($filters);

        return Inertia::render('Admin/Visa/Services', [
            'visas' => [
                'data' => $visas->items(),
                'current_page' => $visas->currentPage(),
                'last_page' => $visas->lastPage(),
                'per_page' => $visas->perPage(),
                'total' => $visas->total(),
            ],
            'filters' => $filters,
            'counts' => $this->visaService->statusCounts(),
        ]);
    }

    /** Country search (from / to) rendered inside the admin layout. */
    public function search(Request $request)
    {
        return Inertia::render('Admin/Visa/Search', $this->requirementsService->pageData($request));
    }

    /**
     * The results for a search. With a destination and citizenship that match
     * a visa, the results page opens on it. Anything else (no match, only one
     * country chosen) stays on the search page, which lists what matches or
     * says that no visa was found. Only an unknown country uid is a 404.
     */
    public function searchResult(Request $request)
    {
        try {
            if ($request->filled('from') && $request->filled('to')) {
                $data = $this->requirementsService->resultData($request);

                if ($data['visas']->isNotEmpty()) {
                    return Inertia::render('Admin/Visa/Result', $data);
                }
            }

            return Inertia::render('Admin/Visa/Search', $this->requirementsService->pageData($request));
        } catch (ValidationException) {
            abort(404);
        }
    }

    /** The wizard steps and the fields each one holds, for validating step by step. */
    private const STEP_FIELDS = [
        1 => ['visa_type_id', 'origin_country_id', 'destination_country_id', 'visa_service_category_id', 'name', 'title', 'description'],
        2 => ['cost_details'],
        3 => ['image'],
        4 => ['status', 'is_featured'],
    ];

    /**
     * Validates the wizard on the server as the user moves on: the fields of
     * every step up to `through`, or only the image right after one is picked.
     * Same rules as saving, so what passes here passes the save.
     */
    public function validateStep(Request $request)
    {
        $control = $request->validate([
            'through' => 'required|integer|between:1,4',
            'only' => 'nullable|in:image',
            'mode' => 'required|in:create,edit',
            'visa' => 'nullable|string|exists:visas,uid',
        ]);

        $ignore = $control['mode'] === 'edit' && !empty($control['visa'])
            ? Visa::where('uid', $control['visa'])->first()
            : null;

        $fields = !empty($control['only'])
            ? [$control['only']]
            : collect(range(1, (int) $control['through']))->flatMap(fn ($step) => self::STEP_FIELDS[$step])->all();

        $rules = collect($this->rules(requireImage: $control['mode'] === 'create', ignore: $ignore))
            ->filter(fn ($rule, $key) => in_array(Str::before($key, '.'), $fields, true))
            ->all();

        $request->validate($rules, $this->messages(), $this->attributes());

        return back();
    }

    public function create()
    {
        return Inertia::render('Admin/Visa/Create', $this->formOptions());
    }

    public function show(Visa $visa)
    {
        return Inertia::render('Admin/Visa/Show', $this->showProps($visa));
    }

    /** The Show page opened on its Assign Field tab. */
    public function editFields(Visa $visa)
    {
        return Inertia::render('Admin/Visa/Show', $this->showProps($visa) + ['initialTab' => 'fields']);
    }

    public function updateFields(UpdateVisaFieldsRequest $request, Visa $visa)
    {
        $this->fieldConfigService->sync($visa, $request->validated('sections'));

        return back()->with('success', 'Visa fields updated successfully');
    }

    public function updateDocuments(UpdateVisaDocumentsRequest $request, Visa $visa)
    {
        $this->documentService->sync($visa, $request->validated('documents'));

        return back()->with('success', 'Visa documents updated successfully');
    }

    public function edit(Visa $visa)
    {
        return Inertia::render('Admin/Visa/Edit', [
            'visa' => $this->visaService->load($visa),
        ] + $this->formOptions());
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules(requireImage: true), $this->messages(), $this->attributes());

        $this->visaService->create(
            $this->visaAttributes($validated),
            $request->file('image'),
            $validated['cost_details'] ?? [],
        );

        return redirect()->route('admin.visa-services.index')->with('success', 'Visa created successfully');
    }

    public function update(Request $request, Visa $visa)
    {
        $validated = $request->validate($this->rules(requireImage: false, ignore: $visa), $this->messages(), $this->attributes());

        $this->visaService->update(
            $visa,
            $this->visaAttributes($validated),
            $request->file('image'),
            $validated['cost_details'] ?? [],
        );

        return redirect()->route('admin.visa-services.index')->with('success', 'Visa updated successfully');
    }

    public function toggleStatus(Request $request, Visa $visa)
    {
        $validated = $request->validate(['status' => 'required|boolean']);

        $this->visaService->setStatus($visa, (bool) $validated['status']);

        return back()->with('success', 'Visa status updated successfully');
    }

    public function destroy(Visa $visa)
    {
        $this->visaService->delete($visa);

        return back()->with('success', 'Visa deleted successfully');
    }

    private function showProps(Visa $visa): array
    {
        $canConfigure = (bool) auth('web')->user()?->hasRole('superadmin');

        return [
            'visa' => $this->visaService->load($visa),
            'currency' => config('currency'),
            'canConfigureFields' => $canConfigure,
            'fieldConfig' => $canConfigure ? $this->fieldConfigService->configuration($visa) : [],
            'visaDocuments' => $canConfigure ? $this->documentService->forVisa($visa) : [],
        ];
    }

    private function formOptions(): array
    {
        return [
            'visaTypes' => $this->visaTypeService->all(),
            'countries' => $this->countryService->all(),
            'categories' => $this->categoryService->all(),
            'currency' => config('currency'),
        ];
    }

    private function visaAttributes(array $validated): array
    {
        return collect($validated)->except(['image', 'cost_details'])->all();
    }

    private function messages(): array
    {
        return [
            'title.required' => 'Please enter the visa title.',
            'title.max' => 'The title must be 255 characters or fewer.',
            'image.required' => 'Please choose an image for the visa.',
            'image.uploaded' => 'The image could not be uploaded. It is probably too large; use one under 5 MB.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a JPG, PNG or GIF file.',
            'image.max' => 'The image must be 5 MB or smaller.',
            'name.unique' => 'A visa with this name already exists.',
        ];
    }

    /** Friendly names for the cost breakdown fields, used in place of "cost_details.0.embassy_fee". */
    private function attributes(): array
    {
        return [
            'cost_details.*.type' => 'Type',
            'cost_details.*.validation_process' => 'Validation Process',
            'cost_details.*.processing_time' => 'Processing Time',
            'cost_details.*.embassy_fee' => 'Embassy Fee',
            'cost_details.*.service_fee' => 'Service Fee',
            'cost_details.*.tax_fee' => 'Tax Fee',
            'cost_details.*.credit_amount' => 'Credit Amount',
            'cost_details.*.tax_amount' => 'Tax Amount',
            'visa_type_id' => 'Visa Type',
            'origin_country_id' => 'Origin Country',
            'destination_country_id' => 'Destination Country',
            'visa_service_category_id' => 'Category',
        ];
    }

    private function rules(bool $requireImage, ?Visa $ignore = null): array
    {
        return [
            'visa_type_id' => 'nullable|exists:visa_types,id',
            'origin_country_id' => 'nullable|exists:countries,id',
            'destination_country_id' => 'nullable|exists:countries,id',
            'visa_service_category_id' => 'nullable|exists:visa_service_categories,id',
            'name' => 'nullable|string|max:255|unique:visas,name' . ($ignore ? ',' . $ignore->id : ''),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => ($requireImage ? 'required' : 'nullable') . '|image|mimes:jpeg,png,jpg,gif|max:5120',
            'status' => 'required|boolean',
            'is_featured' => 'required|boolean',
            'cost_details' => 'nullable|array',
            'cost_details.*.type' => 'nullable|string|max:255',
            'cost_details.*.validation_process' => 'nullable|string|max:255',
            'cost_details.*.processing_time' => 'nullable|string|max:255',
            'cost_details.*.embassy_fee' => 'nullable|numeric|min:0',
            'cost_details.*.service_fee' => 'nullable|numeric|min:0',
            'cost_details.*.tax_fee' => 'nullable|numeric|min:0',
            'cost_details.*.credit_amount' => 'nullable|numeric|min:0',
            'cost_details.*.tax_amount' => 'nullable|numeric|min:0',
        ];
    }
}
