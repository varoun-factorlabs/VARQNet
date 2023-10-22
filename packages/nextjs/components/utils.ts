// @ts-nocheck
import MBirdTsSdk from "./mBirdTsSdk";
export const syntaxHighlight = (obj: any): string => {
    let json = JSON.stringify(obj, undefined, 4);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
    });
}
export function output(command: string, inp: any, isError: boolean): void {
    // ... existing code
}

export function getPaymentNameByType(type: string): Promise<string> {
    return new Promise((resolve) => {
        try {
            MBirdTsSdk.Peripherals.Details()
                .then((details) => {
                    console.log('Details: ', details)
                    const payments = details["Payments"];
                    for (const idx in payments) {
                        if (payments[idx]["Type"] === type) {
                            resolve(payments[idx]["Name"]);
                            return;
                        }
                    }
                    resolve("");
                }).catch((error) => {
                resolve("");
            });
        } catch (ex) {
            resolve("");
        }
    });
}



export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


type InfoType = {
    Scanners?: Array<{ Name: string }>;
    IOBoards?: Array<{ Name: string }>;
};

export function setPeripheralsButtons(info: InfoType): void {
    if (info.Scanners && info.Scanners.length > 0) {
        for (const scanner of info.Scanners) {
            const scannerName = scanner.Name;
            const btnScanner = window.$("#Scanner-Scan").clone(true);
            btnScanner.data("scanner-name", scannerName);
            btnScanner.text(`Scan ${scannerName}`);
            btnScanner.insertAfter("#Scanner-Scan");
            console.log(`Added scanner ${scannerName}`);
        }
        window.$("#Scanner-Scan").remove();
    }

    if (info.IOBoards && info.IOBoards.length > 0) {
        for (const board of info.IOBoards) {
            const boardName = board.Name;
            const btnBoard = window.$("#IOBoard-Command").clone(true);
            btnBoard.data("ioboard-name", boardName);
            btnBoard.text(`IOBoard ${boardName}`);
            btnBoard.insertAfter("#IOBoard-Command");
            btnBoard.removeClass("hide");
            console.log(`Added IOBoard ${boardName}`);
        }
        window.$("#IOBoard-Command").remove();
    }
}

export const uuidv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


// You might not want to have a window.onerror in an importable TypeScript file, as it can cause unexpected behavior.
// Consider moving this to a more appropriate location (like the main file of your application).
export const onerror = function (errorMsg: string, url: string, lineNumber: number): void {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};
