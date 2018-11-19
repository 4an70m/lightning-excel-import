# Lightning-excel-import
Component, which allows you to import excel (.xlsx) documents and get their content in lightning component. Based on the [XLSX.js](https://github.com/SheetJS/js-xlsx) library.

## Use-cases
Use it, when you need your user to import .xlsx files and use its content in you lightning component and/or apex class.

## Usage
To use this component, simply include it in your markup and handle the import event.
```xml
<aura:component>
    ...
    <c:ExcelImport onImport="{!c.myImportHandlingFunction}"/>
    ...
</aura:component>
```
ExcelImport renders into a file [`lightning:input`](https://developer.salesforce.com/docs/component-library/bundle/lightning:input/example#lightningcomponentdemo:exampleInputFile) component with additional handling for Excel table files.

##Supported attributes

| Attribute                 | Type      | Inherited?    | Description                               | Default Value     |
| -                         | :-        | :-:           | :-| -|
| label                     | String    | Yes           | Label for input                           | Import Excel File |
| class                     | String    | Yes           | Additional classes applied to the input   |                   |
| variant                   | String    | Yes           | Input appearance                          | standard          |
| required                  | Boolean   | Yes           | Shows if input is mandatory               | false             |
| disabled                  | Boolean   | Yes           | Disables the input                        | false             |
| accept                    | String    | Yes           | Accepted file types                       | .xls, .xlsx       |
| stretchedDropzone         | Boolean   | No            | Makes dropzone take all availablespace    | false             |
| fileSizeThreshhold        | Integer   | No            | Max file size in bytes                    | 10000000          |
| messageFileSizeExceeded   | String    | No            | File size exceeded message                | File size exceeded|
| messageNoFileSpecified    | String    | No            | No file specified message                 | No file specified |

## Todos
 - Make input support any type of file, processing tables only
 - Improve error handling
 - (?) change some of the attributes interface

## License
MIT
