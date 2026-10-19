<?php

namespace App\Support;

use ZipArchive;

/**
 * A minimal .xlsx writer: one sheet of text cells (the first row bold). An
 * .xlsx file is a zip of a few XML files, so no spreadsheet library is needed.
 */
class SimpleXlsx
{
    /** Writes the rows to a temporary .xlsx file and returns its path. */
    public static function write(array $rows, string $sheetName = 'Sheet1'): string
    {
        $path = tempnam(sys_get_temp_dir(), 'xlsx');
        $zip = new ZipArchive();
        $zip->open($path, ZipArchive::OVERWRITE);

        $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            . '<Default Extension="xml" ContentType="application/xml"/>'
            . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            . '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            . '</Types>');
        $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            . '</Relationships>');
        $zip->addFromString('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            . '<sheets><sheet name="' . self::escape(mb_substr($sheetName, 0, 31)) . '" sheetId="1" r:id="rId1"/></sheets></workbook>');
        $zip->addFromString('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            . '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            . '</Relationships>');
        // Style 1: bold (the header row)
        $zip->addFromString('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            . '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
            . '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
            . '<borders count="1"><border/></borders>'
            . '<cellStyleXfs count="1"><xf/></cellStyleXfs>'
            . '<cellXfs count="2"><xf fontId="0"/><xf fontId="1" applyFont="1"/></cellXfs>'
            . '</styleSheet>');

        $sheet = '';
        foreach (array_values($rows) as $r => $row) {
            $sheet .= '<row r="' . ($r + 1) . '">';
            foreach (array_values($row) as $c => $value) {
                $ref = self::column($c) . ($r + 1);
                $style = $r === 0 ? ' s="1"' : '';
                $sheet .= '<c r="' . $ref . '" t="inlineStr"' . $style . '><is><t xml:space="preserve">' . self::escape((string) $value) . '</t></is></c>';
            }
            $sheet .= '</row>';
        }
        $zip->addFromString('xl/worksheets/sheet1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            . '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' . $sheet . '</sheetData></worksheet>');

        $zip->close();

        return $path;
    }

    /** 0 → A, 25 → Z, 26 → AA */
    private static function column(int $index): string
    {
        $name = '';
        for ($i = $index + 1; $i > 0; $i = intdiv($i - 1, 26)) {
            $name = chr(65 + (($i - 1) % 26)) . $name;
        }

        return $name;
    }

    private static function escape(string $value): string
    {
        // Strip characters XML cannot hold, then escape
        $value = preg_replace('/[^\x{9}\x{A}\x{D}\x{20}-\x{D7FF}\x{E000}-\x{FFFD}]/u', '', $value) ?? '';

        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
