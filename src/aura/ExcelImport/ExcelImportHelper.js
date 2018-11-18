/*
    MIT License

    Copyright (c) 2018 Alex

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */

({
    disableExcelInput: function(cmp) {
        cmp.set("v.disabled", true);
        cmp.set("v.isLoading", true);
    },

    enableExcelInput: function(cmp) {
        cmp.set("v.disabled", false);
        cmp.set("v.isLoading", false);
    },

    importTableAndThrowEvent: function(cmp, evt, helper) {
        evt.stopPropagation();
        evt.preventDefault();
        try {
            const file = helper.validateFile(cmp, evt);
            helper.readExcelFile(file)
                .then($A.getCallback(excelFile => {
                    helper.throwSuccessEvent(cmp, excelFile);
                }))
                .catch($A.getCallback(exceptionMessage => {
                    helper.throwExceptionEvent(cmp, exceptionMessage);

                }))
                .finally($A.getCallback(() => {
                    helper.enableExcelInput(cmp);
                }))
        } catch (exceptionMessage) {
            helper.throwExceptionEvent(cmp, exceptionMessage);
            helper.enableExcelInput(cmp);
        }
    },

    validateFile: function(cmp, evt) {
        const files = evt.getSource().get("v.files");
        if (!files || files.length === 0 || $A.util.isUndefinedOrNull(files[0])) {
            throw cmp.get("v.messageNoFileSpecified");
        }

        const file = files[0];
        const fileSizeThreshold = cmp.get("v.fileSizeThreshold");
        if (file.size > fileSizeThreshold) {
            throw (cmp.get("v.messageFileSizeExceeded") + ': ' + fileSizeThreshold + 'b');
        }
        return file;
    },

    readExcelFile: function(file) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.onload = event => {
                let filename = file.name;
                let binary = "";
                new Uint8Array(event.target.result).forEach(function (byte) {
                    binary += String.fromCharCode(byte);
                });

                try {
                    resolve({
                        "fileName": filename,
                        "xlsx": XLSX.read(binary, {type: 'binary', header: 1})
                    });
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.readAsArrayBuffer(file);
        });
    },

    throwExceptionEvent: function(component, message) {
        const errorEvent = component.getEvent("onImport");
        errorEvent.setParams({
            "type": "ERROR",
            "message": message
        });
        errorEvent.fire();
    },

    throwSuccessEvent: function(component, parsedFile) {
        const successEvent = component.getEvent("onImport");
        successEvent.setParams({
            "type": "SUCCESS",
            "fileName": parsedFile.fileName,
            "table": parsedFile.xlsx
        });
        successEvent.fire();
    }
})