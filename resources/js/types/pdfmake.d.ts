declare module 'pdfmake/build/pdfmake' {
    const pdfMake: {
        createPdf: (docDefinition: unknown) => unknown;
        addVirtualFileSystem: (vfs: Record<string, string>) => void;
    };
    export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
    const vfs: Record<string, string>;
    export default vfs;
}
