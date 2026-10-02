<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice View</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* @media print {
            .no-print { display: none; }
            body { margin: 0; padding: 0; }
            .container { width: 100%; max-width: 100%; }
        } */
            @media print {

    .page-break-before {
        page-break-before: always !important;
    }
    /* Hide everything by default */
    body * {
        visibility: hidden !important;
    }

    /* Show only the print area and its children */
    #print-area, #print-area * {
        visibility: visible !important;
    }

    #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 15px;
    }

    /* Hide specific elements */
    .no-print, .phpdebugbar, .debugbar {
        display: none !important;
    }

    /* Clean print layout */
    body {
        margin: 0;
        padding: 0;
        background: white !important;
    }

    .container {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 15px;
    }
}


        .outer-div {
            background-color: #fff;
            width: 100%;
        }

        .outer-div-inner {
            margin: 2% auto;
            padding: 20px 25px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.07);
        }

        .header-section {
            border-bottom: 2px solid #797777;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .invoice-title {
            text-align: center;
            font-size: 35px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .invoice-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin: 10px 0;
        }

        .invoice-info-box {
            flex: 1;
        }

        .invoice-info-right {
            display:flex;
           justify-content:end;
            flex: 1;
        }

        .to-from-section {
            display: flex;
            gap: 40px;
            margin: 30px 0;
        }

        .to-section, .from-section {
            flex: 1;
        }



        .to-section h3, .from-section h3 {
            font-size: 24px;
            font-weight: 600;
            color: #26ace2;
            margin-bottom: 10px;
        }

        .section-header {
            width:max-content;
            background-color: #26ace2;
            color: white;
            padding: 5px 20px;
            font-size: 18px;
            font-weight: 600;
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .table {
            margin-top: 15px;
            border-collapse: collapse;
            width: 100%;
        }

        .table th {
            background-color: #d0dfea;
            color: #000;
            font-weight: 600;
            padding: 10px;
            border: 1px solid #dee2e6;
            text-transform: uppercase;
        }

        .table td {
            padding: 1px 10px;
            border: 1px solid #dee2e6;
        }

            table.paymenttable {
                width: 50%;
            }

        .text-light-blue {
            color: #26ace2;
            font-weight: 600;
        }

        .summary-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-item.total-row {
            font-weight: 600;
            font-size: 16px;
            border-bottom: 2px solid #333;
            border-top: 2px solid #333;
            padding: 12px 0;
            margin-top: 10px;
        }

        .terms-section {
            margin-top: 5px;
            padding: 10px;
            background-color: #f8f9fa;

        }

        .terms-section h4 {
            font-weight: 600;
            margin-bottom: 15px;
        }

        .terms-section ul {
            margin-left: 20px;
        }

        .terms-section li {
            margin-bottom: 10px;
            text-align: justify;
            line-height: 1.6;
        }

        .signature-section {
            margin-top: 10px;
            text-align: right;
        }

        .signature-line {
            display: inline-block;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 60px;
        }

        .button-section {
            text-align: center;
            margin-top: 30px;
            gap: 10px;
        }

        .float-right {
            float: right;
        }

        .responsive-center {
            text-align: center;
        }

        h1, h2, h3, h4 {
            margin-top: 0;
        }

        .print-button {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .print-button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
@php
    // Values from this booking (see DocumentSignService::invoiceData)
    $currency = $booking->currency_symbol;
    $origin = $details['origin'] ?? 'N/A';
    $destination = $details['destination'] ?? 'N/A';
    $visaName = $details['visa_name'] ?? 'N/A';
    $visaType = $details['visa_type'] ?? 'N/A';

    // One applicant's share of each charge
    $visaFee = (float) ($details['embassy_fee'] ?? $perPerson['base']);
    $serviceCharge = (float) ($details['service_fee'] ?? $perPerson['service']);
    $vatCharge = (float) ($details['tax_fee'] ?? $perPerson['tax']);
    $showVat = $booking->tax_amount > 0;

    $price = (float) $booking->total_amount;
    $paymentMode = 'CASH';
    $terms = config('document_sign.terms');
@endphp


<div id="print-area">
<div class="outer-div" id="ViewApplicationDiv">
    <div class="outer-div-inner container">

        <div style="text-align: left; border-bottom:1px solid black; padding-bottom:10px">
            <img src="{{ $brand['logo'] ?: asset('assets/images/logo.png') }}"
                alt="{{ $brand['name'] }}"
                style="height: 50px;">
        </div>


    <div class="invoice-info">
        <div class="invoice-info-box"></div>
        <div class="invoice-info-box">
                  <div class="invoice-title">INVOICE</div>

        </div>
        <div class="invoice-info-right">
            <table style=" border: none;">
                <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap;line-height:19px">Invoice Date</td>
                    <td style="border: none; font-weight: bold;  white-space:nowrap; padding:0px 6px;line-height:19px"><span style="font-weight:bold">:</span></td>
                    <td style="border: none; width:60px; white-space:nowrap;line-height:19px">{{ $booking->created_at->format('d F Y') }}</td>
                </tr>
                <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap;line-height:19px">Invoice No</td>
                    <td style="border: none; font-weight: bold; white-space:nowrap; padding:0px 6px;line-height:19px"><span style="font-weight:bold">:</span></td>
                    <td style="border: none; width:60px; white-space:nowrap;line-height:19px">{{ $booking->invoice_number }}</td>
                </tr>
                <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap;line-height:19px">Client ID</td>
                    <td style="border: none; font-weight: bold; white-space:nowrap; padding:0px 6px;line-height:19px"><span style="font-weight:bold">:</span></td>
                    <td style="border: none; width:60px; white-space:nowrap;line-height:19px">{{ $clientId ?? '' }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="to-from-section" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; margin: 20px 0;">
    <!-- TO SECTION (Left) -->
    <div class="to-section" style="flex: 1; text-align: left;">
        <h3 style="font-size: 24px; font-weight: 600; color: #26ace2; margin-bottom: 10px;">To</h3>

        <p style="margin: 0; line-height:19px">
            {{ strtoupper($to['name']) }}<br>
            @foreach($to['lines'] as $line)
                {{ strtoupper($line) }}<br>
            @endforeach
        </p>
    </div>
    <div style="width:26%">

    </div>

    <!-- FROM SECTION (Right) -->
    <div class="from-section" style="flex: 1; ">

        <div class="invoice-info-right">
        <table style=" border: none;">
             <tr>
                    <td style="border: none; width:60px; white-space:nowrap" colspan="3"><h3 style="font-size: 24px; font-weight: 600; color: #26ace2; margin-bottom: 10px;">Issued By</h3></td>
                </tr>
                @foreach($issuedBy['lines'] as $i => $line)
                <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap">{{ $i === 0 ? 'ADDRESS' : '' }}</td>
                    <td style="border: none; font-weight: bold;  white-space:nowrap; padding:0px 6px">@if($i === 0)<span style="font-weight:bold">:</span>@endif</td>
                    <td style="border: none; width:60px; white-space:nowrap; line-height:17px">{{ strtoupper($line) }}</td>
                </tr>
                @endforeach
                 <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap;line-height:19px">TEL</td>
                    <td style="border: none; font-weight: bold;  white-space:nowrap; padding:0px 6px; line-height:19px"><span style="font-weight:bold">:</span></td>
                    <td style="border: none; width:60px; white-space:nowrap; line-height:19px">{{ $issuedBy['phone'] }}</td>
                </tr>
                 <tr>
                    <td style="border: none; font-weight: bold; width:60px; white-space:nowrap;line-height:19px">E-MAIL</td>
                    <td style="border: none; font-weight: bold;  white-space:nowrap; padding:0px 6px; line-height:19px"><span style="font-weight:bold">:</span></td>
                    <td style="border: none; width:60px; white-space:nowrap; line-height:19px">{{ $issuedBy['email'] }}</td>
                </tr>
            </table>
                </div>

        </div>
</div>


    <div class="section-header">VISA SERVICES</div>

    <table class="table">
        <thead>
            <tr>
                <th>APPLICANT NAME</th>
                <th>COUNTRY</th>
                <th>VISA TYPE</th>
                <th>VISA FEES</th>
                <th>SERVICE CHARGE</th>
                @if($showVat)
                  <th>VAT CHARGE</th>
                @endif
                <th>AMOUNT</th>
            </tr>
        </thead>
        <tbody>
            {{-- One row per applicant on the booking --}}
            @foreach($booking->applications as $application)
                <tr>
                    <td>{{ strtoupper($application->first_name . ' ' . $application->last_name) }}</td>
                    <td>{{ strtoupper($origin) }} <br>
                        To <br>
                        {{ strtoupper($destination) }}
                    </td>
                    <td>
                    {{ strtoupper($visaName) }}<br>

                    {{ strtoupper($visaType) }}
                    </td>
                    <td>{{ $currency }}{{ number_format($visaFee, 2) }}</td>
                    <td>{{ $currency }}{{ number_format($serviceCharge, 2) }}</td>
                    @if($showVat)
                        <td>{{ $currency }}{{ number_format($vatCharge, 2) }}</td>
                    @endif
                    <td>{{ $currency }}{{ number_format($application->amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h5 style="text-align: right; margin-top: 15px;"><strong>Total: <span class="text-light-blue">{{ $currency }}{{ number_format($price, 2) }}</span></strong></h5>

    <div style="margin-top: 20px;">
        <h4><strong>Payment Details</strong></h4>
        <table class="paymenttable table">
            <thead>
                <tr>
                    <th>PAYMENT MODE</th>
                    <th>AMOUNT</th>
                    <th>DATE</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ strtoupper($paymentMode) }}</td>
                    <td>{{ $currency }} {{ number_format($price, 2) }}</td>
                    <td>{{ $booking->created_at->format('d-m-Y') }}</td>
                </tr>
            </tbody>
        </table>
    </div>



   @if(!empty($booking->invoice_remark))
    <div style="margin-top: 40px;">
        <h4>Remark</h4>
        {{-- Cleaned to basic formatting when it was saved --}}
        <div>{!! $booking->invoice_remark !!}</div>

    </div>
    @endif

    <div class="terms-section page-break-before">
        <h4>Terms and Conditions</h4>
        <ul>
            @foreach ($terms as $term)
                <li>
                    <strong>{{ $term['heading'] }}</strong><br>
                    {{ $term['description'] }}
                </li>
            @endforeach
        </ul>
    </div>

    <div class="signature-section">
        @if($signature?->isSigned())
            <img src="{{ $signature->signature_data }}" alt="Signature" style="height: 80px; max-width: 260px;"><br>
            <div class="signature-line" style="margin-top: 0;">
                {{ strtoupper($signature->signer_name) }}<br>
                <small>Signed {{ $signature->signed_at->format('d F Y, H:i') }}</small>
            </div>
        @endif
    </div>

    <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #26ace2;">
        <section class="footer">
            <div class="row" style="display: flex; justify-content: space-between; margin: 0;">
                <div class="col-md-6" style="flex: 1; text-align: left;">
                    <img src="{{ $brand['logo'] ?: asset('assets/images/logo.png') }}" style="height: 40px; width: auto;" alt="">
                </div>
                <div class="col-md-6" style="flex: 1; text-align: right;">
                    <img src="https://seeklogo.com/images/I/information-commissioners-office-logo-1743AEAE1C-seeklogo.com.png" style="height: 40px; width: auto;" alt="">
                </div>
            </div>
        </section>
    </div>

    <div class="button-section no-print">
        <button onclick="printInvoice()" class="print-button">
            <i class="fas fa-print"></i> Print Invoice
        </button>
    </div>
</div>
</div>
</div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    function printInvoice() {
        window.print();
    }
    </script>
</body>
</html>
