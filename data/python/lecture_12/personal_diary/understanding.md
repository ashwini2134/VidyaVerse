# Understanding

File I/O is what makes data persist beyond a single program run. This project uses three file modes: `"r"` for reading, `"a"` for appending, and `"w"` for overwriting. The custom delimiter pattern (`===ENTRY===`) is a simple version of how real file formats work (JSON, CSV, XML all use delimiters or structured markup). The **load-modify-save** pattern (for delete) is the same approach used in database applications.
