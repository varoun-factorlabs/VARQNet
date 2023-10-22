/*
Acrelec Software (c) 2016 - 2023
version 9.3.1.4
release date: 19.04.2023
*/
// @ts-nocheck
module MBirdSdk {

    declare var window: IMyWindow;
    var _canBeClosed: (payload?: any) => void;
    var _canReceiveChannelContent: (payload?: any) => void;

    export function isConnected() {
        var sdkHandler = window["JavaScriptSdkHandlerFullAsync"] as IJavaScriptSdkHandler;
        return ( typeof(sdkHandler) !== "undefined" && sdkHandler !== null );
    }

    export function SdkVersion() {
        return "9.3.1.3";
    }

    class Base {

        protected static executeCommand(command: string): Promise<object> {
            var sdkHandler = window["JavaScriptSdkHandlerFullAsync"] as IJavaScriptSdkHandler;

            return new Promise((resolve) => {
                sdkHandler.executeWithCommand(command, (response) => {
                    var responseParsed: Object = "";

                    try {
                        responseParsed = JSON.parse(response);
                    } catch (ex) {
                        resolve(response);
                    }

                    if (sdkHandler && command != null) {
                        try {
                            var obj = JSON.parse(responseParsed.toString());
                            resolve(obj);
                        } catch (ex) {
                            resolve(responseParsed);
                        }
                    }

                    resolve(response);
                });
            });
        }

        protected static executeNumber(command: string, value?: number): Promise<object> {
            var sdkHandler = window["JavaScriptSdkHandlerFullAsync"] as IJavaScriptSdkHandler;

            return new Promise((resolve) => {

                sdkHandler.executeWithNumber(command, value, (response) => {
                    var responseParsed: Object = "";

                    try {
                        responseParsed = JSON.parse(response);
                    } catch (ex) {
                        resolve(response);
                    }

                    if (sdkHandler && command != null) {
                        try {
                            var obj = JSON.parse(responseParsed.toString());
                            resolve(obj);
                        } catch (ex) {
                            resolve(responseParsed);
                        }
                    }

                    resolve(response);
                });
            });
        }

        protected static executeString(command: string, content?: string): Promise<object> {
            var sdkHandler = window["JavaScriptSdkHandlerFullAsync"] as IJavaScriptSdkHandler;

            return new Promise((resolve) => {
                sdkHandler.executeWithString(command, content, (response) => {
                    var responseParsed: Object = "";

                    try {
                        responseParsed = JSON.parse(response);
                    } catch (ex) {
                        resolve(response);
                    }

                    if (sdkHandler && command != null) {
                        try {
                            var obj = JSON.parse(responseParsed.toString());
                            resolve(obj);
                        } catch (ex) {
                            resolve(responseParsed);
                        }
                    }

                    resolve(response);
                });
            });
        }

        protected static executeIoCommand(command: string, parameters: string, content?: any): Promise<object> {
            var sdkHandler = window["JavaScriptSdkHandlerFullAsync"] as IJavaScriptSdkHandler;

            return new Promise((resolve) => {

                sdkHandler.executeIoCommand(command, parameters, content, (response) => {
                    var responseParsed: Object = "";

                    try {
                        responseParsed = JSON.parse(response);
                    } catch (ex) {
                        resolve(response);
                    }

                    if (sdkHandler && command != null) {
                        try {
                            var obj = JSON.parse(responseParsed.toString());
                            resolve(obj);
                        } catch (ex) {
                            resolve(responseParsed);
                        }
                    }

                    resolve(response);
                });
            });
        }
    }

    export class Admin extends Base {
        static Open(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("OpenAdmin").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }
    }

    export class App extends Base {

        static Hide(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("Hide").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static GetDetails(): Promise<object> {
            console.warn("App.GetDetails will be deprecated in the future, use Settings.AppDetails instead");
            return Settings.AppDetails();
        }

        static GetToken(): Promise<object> {
            console.warn("App.GetToken will be deprecated in the future, use Settings.GetToken instead");
            return Settings.GetToken();
        }

        static WriteLog(message: string, isError: boolean): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (message == null || message.length === 0) {
                    reject("Log message is empty!");
                    return;
                }

                var obj: any = {
                    message: message,
                    isError: isError
                };

                Base.executeString("WriteLog", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static DeveloperTools(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("ShowDevTools").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });

            });
        }

        static BrowserVersion(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetBrowserVersion").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static OnInactivity(callback: () => void) {
            console.warn("App.OnInactivity will be deprecated in the future, use Callbacks.Inactivity instead");
            return Callbacks.Inactivity(callback);
        }
    }

    export class Callbacks extends Base {
        static Inactivity(callback: (payload?: any) => void) {
            CallbacksManager.On("Inactivity", callback);
        }
    }

    export class ChannelCallbacks extends Base {
        static CanReceiveChannelContent(callback: (payload?: any) => void) {
            _canReceiveChannelContent = callback;
        }

        static ChannelContentReceived(callback: (payload?: any) => void) {
            CallbacksManager.On("ChannelCallbacks.ChannelContentReceived", callback);
        }
    }

    export class SingleAppCallbacks extends Base {
        static CanBeClosed(callback: (payload?: any) => void) {
            _canBeClosed = callback;
        }
    }

    export class UserInterface extends Base {
        static CloseButton(alignment: UIAlignment, imageBase64: string, xPadding: number, yPadding: number): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (alignment == null) {
                    reject("Alignment type cannot be null!");
                    return;
                }

                var obj: any = {
                    xPadding: xPadding,
                    yPadding: yPadding,
                    alignment: UIAlignment[alignment],
                    imageBase64: imageBase64
                };

                Base.executeString("UIChangeCloseButton", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static HideBrowser(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("HideBrowser").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class Core extends Base {

        static DeveloperTools(): Promise<object> {
            console.warn("Core.DeveloperTools will be deprecated in the future, use App.DeveloperTools instead");
            return App.DeveloperTools();
        }

        static BrowserVersion(): Promise<object> {
            console.warn("Core.BrowserVersion will be deprecated in the future, use App.BrowserVersion instead");
            return App.BrowserVersion();
        }

        static OpenAdmin(): Promise<boolean> {
            console.warn("Core.OpenAdmin is deprecated, please use Admin.Open instead!");
            return Admin.Open();
        }

        static GetVolume(): Promise<Number> {
            console.warn("Core.GetVolume is deprecated, please use Volume.Get instead!");
            return Volume.Get();
        }

        static GetWeather(): Promise<object> {
            console.warn("Core.GetWeather is deprecated, please use Weather.Current instead!");
            return Weather.Current();
        }

        static UpdateVolume(value: string): Promise<boolean> {
            console.warn("Core.UpdateVolume is deprecated, please use Volume.Update instead!");
            return Volume.Update(value);
        }

        static Hide(): Promise<boolean> {
            console.warn("Core.Hide is deprecated, please use App.Hide instead!");
            return App.Hide();
        }

        static CallbackWithResponse(message: string, params?: any): any {
            switch (message) {
                case "SingleAppCallbacks.CanBeClosed":
                {
                    return _canBeClosed.call(params);
                }
                case "ChannelCallbacks.CanReceiveChannelContent":
                {
                    return _canReceiveChannelContent.call(params);
                }
            }

            return null;
        }

        static Callback(message: string, params?: any) {
            var response: string;
            switch (message) {
                case "BundlesettingsChanged":
                {
                    CallbacksManager.Trigger("BundlesettingsChanged", null);
                    break;
                }

                case "KioskSettingsChanged":
                {
                    CallbacksManager.Trigger("KioskSettingsChanged", null);
                    break;
                }

                case "StoreSettingsChanged":
                {
                    CallbacksManager.Trigger("StoreSettingsChanged", null);
                    break;
                }

                case "PayProgress":
                {
                    try {
                        response = JSON.parse(params);
                    } catch (ex) {
                        response = params;
                    }
                    CallbacksManager.Trigger("PayProgress", response);
                    break;
                }

                case "NewMessage":
                {
                    try {
                        response = JSON.parse(params);
                    } catch (ex) {
                        response = params;
                    }
                    CallbacksManager.Trigger("NewMessage", response);
                    break;
                }
                case "WingsNewMessage":
                {
                    try {
                        response = JSON.parse(params);
                    } catch (ex) {
                        response = params;
                    }
                    CallbacksManager.Trigger("WingsNewMessage", response);
                    break;
                }

                case "AsyncResponse":
                {
                    try {
                        response = JSON.parse(params);
                    } catch (ex) {
                        response = params;
                    }
                    CallbacksManager.Trigger("WingsNewMessage", response);
                    break;
                }

                case "Inactivity":
                {
                    CallbacksManager.Trigger("Inactivity");
                    break;
                }

                case "ChannelCallbacks.ChannelContentReceived":
                {
                    CallbacksManager.Trigger("ChannelCallbacks.ChannelContentReceived");
                    break;
                }

                case "ConsumptionCallbacks.Warning":
                {
                    CallbacksManager.Trigger("ConsumptionCallbacks.Warning", params);
                    break;
                }

                case "ConsumptionCallbacks.LastCall":
                {
                    CallbacksManager.Trigger("ConsumptionCallbacks.LastCall", params);
                    break;
                }

                case "EventRaised":
                {
                    try {
                        response = JSON.parse(params);
                    } catch (ex) {
                        response = params;
                    }
                    CallbacksManager.Trigger("EventRaised", response);
                    break;
                }
            }
        }
    }

    export class Board extends Base {
        static ShowNotification(title: string, message: string, notificationType: NotificationType, switchToAppIdentifier: string, fullNotification: boolean): Promise<boolean> {
            console.warn("Board.ShowNotification is deprecated, please use Notification.Show instead!");
            return Notification.Show(title, message, notificationType, switchToAppIdentifier, fullNotification);
        }

        static GetInfo(): Promise<object> {
            console.warn("Board.GetInfo is deprecated, please use Settings.GetToken and Settings.GetCapabilities instead!");

            return new Promise((resolve, reject) => {
                Base.executeCommand("GetInfo").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Capabilities(): Promise<object> {
            console.warn("Board.GetInfo is deprecated, please use Settings.GetToken and Settings.GetCapabilities instead!");

            return Settings.GetCapabilities();
        }

        static Tags(): Promise<object> {
            console.warn("Board.Tags is deprecated, please use Environment.Tags instead!");
            return Environment.Tags();
        }

        static GetWorkingHours(): Promise<object> {
            console.warn("Board.GetWorkingHours is deprecated, please use Environment.WorkingHours instead!");
            return Environment.WorkingHours();
        }
    }

    export class Weather extends Base {

        static Current(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetWeather").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class Volume extends Base {

        static Update(value: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (value == null || value.length === 0) {
                    reject("Value cannot be null or empty!");
                    return;
                }

                Base.executeNumber("UpdateVolume", parseInt(value)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static Get(): Promise<Number> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetVolume").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(Number(response.Result));
                });
            });
        }

    }

    export class Notification extends Base {

        static Show(title: string, message: string, notificationType: NotificationType, switchToAppIdentifier: string, fullNotification: boolean): Promise<boolean> {
            return new Promise((resolve, reject) => {

                if (title == null || title.trim().length === 0) {
                    reject("Notification title is empty");
                    return;
                }

                if (message == null || message.trim().length === 0) {
                    reject("Notification message is empty");
                    return;
                }

                var notificationTypeValue = "message";

                if (notificationType === NotificationType.HtmlContent)
                    notificationTypeValue = "htmlcontent";

                if (notificationType === NotificationType.HtmlFile)
                    notificationTypeValue = "htmlfile";

                if (notificationType === NotificationType.WarningMessage)
                    notificationTypeValue = "warning_message";

                if (notificationType === NotificationType.InfoMessage)
                    notificationTypeValue = "info_message";

                var obj: any = {
                    title: title,
                    message: message,
                    switchToAppIdentifier: switchToAppIdentifier,
                    notificationType: notificationTypeValue,
                    fullNotification: fullNotification
                };

                Base.executeString("ShowNotification", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }


        static SwitchToApp(appIdentifier: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (appIdentifier == null || appIdentifier.length === 0) {
                    reject("AppIdentifier cannot be null or empty!");
                    return;
                }

                Base.executeString("SwitchToApp", appIdentifier).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

    }

    export class IOBoard extends Base {
        static ExecuteCommand(commandType: IOBoardCommandType, params?: any, ioBoardName: string = ""): Promise<boolean> {

            return new Promise((resolve, reject) => {

                if (commandType == null) {
                    reject("Command type cannot be null!");
                    return;
                }

                var obj: any = {
                    commandType: IOBoardCommandType[commandType],
                    params: params,
                    IOBoardName: ioBoardName
                };

                Base.executeString("ExecuteIOBoardCommand", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Status(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                Base.executeString("IOBoard.Status").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

    }

    export class Scanner extends Base {
        static Scan(value: number, scannerName: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                if (scannerName == null || scannerName == "") {
                    Base.executeNumber("Scan", value).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(response.Result);
                    });
                } else {
                    // scan with name

                    var obj: any = {
                        ScannerName: scannerName,
                        Value: value
                    };

                    Base.executeString("ScanWithName", JSON.stringify(obj)).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(response.Result);
                    });
                }
            });
        }
    }

    export class Nfc extends Base {
        static Read(value: number): Promise<object> {
            console.warn("Nfc.Read will be deprecated in the future, use NfcReader.Read instead");
            return NfcReader.Read(value);
        }

        static ReadFileInfo(value: number, applicationId: string, authenticationKey: string): Promise<object> {
            console.warn("Nfc.ReadFileInfo will be deprecated in the future, use NfcReader.FileInfo instead");
            return NfcReader.FileInfo(value, applicationId, authenticationKey);
        }
    }

    export class NfcReader extends Base {
        static Read(value: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                Base.executeNumber("NfcRead", value).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static FileInfo(value: number, applicationId: string, authenticationKey: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                if (applicationId.trim().length === 0) {
                    reject("Application Id is empty");
                    return;
                }

                if (authenticationKey.trim().length === 0) {
                    reject("Authentication Key is empty");
                    return;
                }

                var obj: any = {
                    ApplicationID: applicationId.trim(),
                    AuthenticationKey: authenticationKey.trim(),
                    Seconds: value
                };

                Base.executeString("NfcReadFileInfo", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static FileInfoWithFileDetails(value: number, applicationId: string, authenticationKey: string, fileID: string, communicationType: string, fileLength: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                if (fileID.trim().length === 0) {
                    reject("File ID is empty");
                    return;
                }

                if (fileLength <= 0) {
                    reject("File length must be greater than 0");
                    return;
                }

                var obj: any = {
                    ApplicationID: applicationId.trim(),
                    AuthenticationKey: authenticationKey.trim(),
                    CommunicationType: communicationType.trim(),
                    FileID: fileID.trim(),
                    FileLength: fileLength,
                    Seconds: value
                };

                console.log(obj);

                Base.executeString("NfcReadFileInfoWithFileDetails", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class MagReader extends Base {
        static Read(value: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                Base.executeNumber("MagReader.Read", value).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class Camera extends Base {
        static Snapshot(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("CameraSnapshot").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class FiscalPrinter extends Base {
        static PrintFiscalTicket(value: string, hasMerchantReceipt?: boolean, hasCustomerReceipt?: boolean, printPayReceiptsFirst?: boolean): Promise<object> {
            return new Promise((resolve, reject) => {
                try {
                    JSON.parse(value);
                } catch (e) {
                    reject("The ticket text is not a valid JSON");
                    return;
                }

                var objWithName = {
                    content: value,
                    hasMerchantReceipt: hasMerchantReceipt,
                    hasCustomerReceipt: hasCustomerReceipt,
                    printPayReceiptsFirst: printPayReceiptsFirst
                };

                Base.executeString("FiscalPrinter.PrintFiscalTicketWithParams", JSON.stringify(objWithName)).then(
                    (response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(true);
                    });
            });
        }
    }

    export class Printer extends Base {
        static TagContent(value: string, name: string = ""): Promise<object> {
            console.warn("Printer.TagContent will be deprecated in the future, use Printer.PrintTagContent instead");
            return Printer.PrintTagContent(value, name);
        }

        static PrintTagContent(value: string, name: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Print text cannot be empty");
                    return;
                }

                if (name.trim() === "") {
                    // need to keep this for backward compatibility
                    Base.executeString("PrintTagContent", value).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(true);
                    });
                } else {
                    var objWithName: any = {
                        Value: value,
                        PrinterName: name
                    };

                    Base.executeString("PrintTagContentWithName", JSON.stringify(objWithName)).then(
                        (response: ISdkResponse) => {
                            if (response.Error) {
                                reject(response.Error);
                                return;
                            }
                            resolve(true);
                        });
                }
            });
        }

        static SaveReceiptTagContent(value: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Print text cannot be empty");
                    return;
                }

                Base.executeString("Printer.SaveReceiptTagContent", value).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static GenerateBase64ReceiptTagContent(content: string, receiptWidthInPixels?: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (content == null) {
                    reject("Print text cannot be empty");
                    return;
                }
                var objWithName: any = {
                    Content: content,
                    ReceiptWidthInPixels: receiptWidthInPixels
                };
                Base.executeString("Printer.GenerateBase64ReceiptTagContent", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class Scale extends Base {
        static MeasureWeight(value: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("Timeout seconds is invalid");
                    return;
                }

                Base.executeNumber("MeasureWeight", value).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class Peripherals extends Base {
        static Status(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetPeripheralsStatus").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static StatusDetails(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetPeripheralsStatusDetails").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Details(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetPeripheralDetails").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static SpecificStatusDetails(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("PeripheralsSpecificStatusDetails").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }


    export class Payment extends Base {
        static Pay(amount: number, transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {

                if (Number.isInteger(amount) == false) {
                    reject({
                        Error: "Pay error",
                        Description : "The amount must be an integer, current value: " + amount
                    });
                    return;
                }

                if (amount <= 0) {
                    reject({
                        Error: "Pay error",
                        Description : "The amount must be greater than 0, current value: " + amount
                    });
                    return;
                }

                var obj: any = {
                    Amount: amount.toString(),
                    TransactionReference: transactionReference,
                    Params: params
                };

                if (name.trim() === "") {
                    // need to keep this for backward compatibility
                    Base.executeString("Pay", JSON.stringify(obj)).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject({
                                Error: response.Error,
                                Description: response.Description
                            });
                            return;
                        }
                        resolve(response.Result);
                    });
                } else {
                    // prepare object for payment with name
                    var objWithName: any = {
                        PayRequest: obj,
                        PaymentName: name
                    };

                    Base.executeString("PayWithName", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject({
                                Error: response.Error,
                                Description: response.Description
                            });
                            return;
                        }
                        resolve(response.Result);
                    });
                }
            });
        }

        static ElectronicPay(amount: number, transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {

                if (Number.isInteger(amount) == false) {
                    reject({
                        Error: "Pay error",
                        Description : "The amount must be an integer, current value: " + amount
                    });
                    return;
                }

                if (amount <= 0) {
                    reject({
                        Error: "Pay error",
                        Description : "The amount must be greater than 0, current value: " + amount
                    });
                    return;
                }

                // prepare object for payment
                var obj: any = {
                    PayRequest: {
                        Amount: amount.toString(),
                        TransactionReference: transactionReference,
                        Params: params
                    },
                    PaymentName: name
                };

                Base.executeString("ElectronicPay", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GetInventory(name: string = "") : Promise<object> {
            return new Promise((resolve, reject) => {
                // prepare object for payment
                var obj: any = {
                    PaymentName: name
                };

                Base.executeString("GetInventory", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result.Inventory);
                });
            });
        }

        static CashBack(transactionReferenceToBeReturned: string, name: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {

                if (transactionReferenceToBeReturned  == null || transactionReferenceToBeReturned == "") {
                    reject({
                        Error: "Pay error",
                        Description : "Transaction reference is invalid"
                    });
                    return;
                }

                // prepare object for payment
                var obj: any = {
                    TransactionReferenceToBeReturned: transactionReferenceToBeReturned,
                    PaymentName: name
                };

                Base.executeString("CashBack", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GetAcceptedCurrencies(name: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {
                // prepare object for payment
                var obj: any = {
                    PaymentName: name
                };

                Base.executeString("GetAcceptedCurrencies", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static StartAcceptMoney(name: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {
                // prepare object for payment
                var obj: any = {
                    PaymentName: name
                };

                Base.executeString("StartAcceptMoney", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static EndAcceptMoney(amountToBeKept: number, name: string = "", params: string = null, transactionReference: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {

                if (Number.isInteger(amountToBeKept) == false) {
                    reject({
                        Error: "Pay error",
                        Description : "The amount must be an integer, current value: " + amountToBeKept
                    });
                    return;
                }

                // prepare object for payment
                var obj: any = {
                    PayRequest: {
                        Amount: amountToBeKept.toString(),
                        Params: params,
                        TransactionReference: transactionReference
                    },
                    PaymentName: name
                };

                Base.executeString("EndAcceptMoney", JSON.stringify(obj)).then((response: IEndPaymentSdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description,
                            PaidAmount: response.PaidAmount,
                            RefundAmount: response.RefundAmount
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static ExecuteCommand(command: PaymentCommandType, commandInfo: string = "", name: string = ""): Promise<object> {
            return new Promise((resolve, reject) => {

                // prepare object
                var obj: any = {
                    Command: PaymentCommandType[command],
                    CommandInfo: commandInfo,
                    PaymentName: name
                };

                Base.executeString("PayExecuteCommand", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static PayAuthorization(amount: number, transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {

                if (Number.isInteger(amount) == false) {
                    reject({
                        Error: "PayAuthorization error",
                        Description : "The amount must be an integer, current value: " + amount
                    });
                    return;
                }

                if (amount <= 0) {
                    reject({
                        Error: "PayAuthorization error",
                        Description : "The amount must be greater than 0, current value: " + amount
                    });
                    return;
                }

                var obj: any = {
                    Amount: amount.toString(),
                    TransactionReference: transactionReference,
                    Params: params
                };

                // prepare object for payment with name
                var objWithName: any = {
                    PayRequest: obj,
                    PaymentName: name
                };

                Base.executeString("PayAuthorization", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static PayRecord(amount: number, transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {

                if (Number.isInteger(amount) == false) {
                    reject({
                        Error: "PayRecord error",
                        Description : "The amount must be an integer, current value: " + amount
                    });
                    return;
                }

                if (amount < 0) {
                    reject({
                        Error: "PayRecord error",
                        Description : "The amount must be greater than 0, current value: " + amount
                    });
                    return;
                }

                var obj: any = {
                    Amount: amount.toString(),
                    TransactionReference: transactionReference,
                    Params: params
                };

                // prepare object for payment with name
                var objWithName: any = {
                    PayRequest: obj,
                    PaymentName: name
                };

                Base.executeString("PayRecord", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static PayTransactionStart(transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {
                var obj: any = {
                    TransactionReference: transactionReference,
                    Params: params
                };

                // prepare object for payment with name
                var objWithName: any = {
                    PayTransactionStartRequest: obj,
                    PaymentName: name
                };

                Base.executeString("PayTransactionStart", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static PayTransactionUpdate(amount: number, transactionReference: string, type:PaymentTransactionType, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {
                var obj: any = {
                    Amount: amount.toString(),
                    TransactionReference: transactionReference,
                    Params: params,
                    Type: PaymentTransactionType[type]
                };

                // prepare object for payment with name
                var objWithName: any = {
                    PayTransactionUpdateRequest: obj,
                    PaymentName: name
                };

                Base.executeString("PayTransactionUpdate", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static PayTransactionEnd(amount: number, transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {
                var obj: any = {
                    Amount: amount.toString(),
                    TransactionReference: transactionReference,
                    Params: params
                };

                // prepare object for payment with name
                var objWithName: any = {
                    PayRequest: obj,
                    PaymentName: name
                };

                Base.executeString("PayTransactionEnd", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static CancelPay(transactionReference: string, name: string = "", params: string = null): Promise<object> {
            return new Promise((resolve, reject) => {
                var obj: any = {
                    TransactionReference: transactionReference,
                    Params: params
                };

                // prepare object for payment with name
                var objWithName: any = {
                    CancelPayRequest: obj,
                    PaymentName: name
                };

                Base.executeString("CancelPay", JSON.stringify(objWithName)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject({
                            Error: response.Error,
                            Description: response.Description
                        });
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GetLastPaymentReceipt() : Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetLastPaymentReceipt").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static OnProgress(callback: (payload?: any) => void) {
            console.warn("Payment.OnProgress will be deprecated in the future, use PaymentCallbacks.PayProgress instead");
            PaymentCallbacks.PayProgress(callback);
        }
    }

    export class PaymentCallbacks extends Base {
        static PayProgress(callback: (payload?: any) => void) {
            CallbacksManager.On("PayProgress", callback);
        }
    }

    class TraceTimeline extends Base {

        static Start(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                Base.executeString("Trace.TraceTimeline.Start").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Add(traceIdentifier: string, type: string): Promise<boolean> {
            return new Promise((resolve, reject) => {

                var data = {
                    TraceIdentifier: traceIdentifier,
                    Type: type
                };

                Base.executeString("Trace.TraceTimeline.Add", JSON.stringify(data)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static Stop(traceIdentifier: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                Base.executeString("Trace.TraceTimeline.Stop", traceIdentifier).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }
    }

    export class Trace extends Base {

        static AddTransaction(transactionWasSuccessful: boolean, transactionReference: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (transactionWasSuccessful == null) {
                    reject("You must specify if transaction was successful or not");
                    return;
                }

                var transaction = {
                    TransactionWasSuccessful: transactionWasSuccessful,
                    TransactionReference: transactionReference
                };

                Base.executeString("TraceTransaction", JSON.stringify(transaction)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static AddEvent(event: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                try {
                    JSON.parse(event);
                } catch (e) {
                    reject("Event is not a valid JSON");
                    return;
                }

                Base.executeString("TraceEvent", event).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static AddAlert(alertType: string, emailSubject: string, emailBody: string, details: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                try {
                    if (details !== "")
                        JSON.parse(details);
                } catch (e) {
                    reject("Details is not a valid JSON");
                    return;
                }

                var alert = {
                    AlertType: alertType,
                    EmailSubject: emailSubject,
                    EmailBody: emailBody,
                    Details: details
                };

                Base.executeString("AddAlert", JSON.stringify(alert)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static AddStatus(status: string): Promise<boolean> {
            return new Promise((resolve, reject) => {

                try {
                    JSON.parse(status);
                } catch (e) {
                    reject("Status is not a valid JSON");
                    return;
                }

                Base.executeString("TraceStatus", status).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static AddEventsList(list: string): Promise<boolean> {
            return new Promise((resolve, reject) => {

                try {
                    JSON.parse(list);
                } catch (e) {
                    reject("The events list is not a valid JSON");
                    return;
                }

                Base.executeString("Trace.List", list).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static Transaction(transactionWasSuccessful: boolean, transactionReference: string): Promise<boolean> {
            console.warn("Trace.Transaction will be deprecated in the future, use Trace.AddTransaction instead");
            return Trace.AddTransaction(transactionWasSuccessful, transactionReference);
        }

        static Event(event: Object): Promise<boolean> {
            console.warn("Trace.Event will be deprecated in the future, use Trace.AddEvent instead");
            return Trace.AddEvent(JSON.stringify(event));
        }

        static Status(status: Object): Promise<boolean> {
            console.warn("Trace.Status will be deprecated in the future, use Trace.AddStatus instead");
            return Trace.AddStatus(JSON.stringify(status));
        }

        static Timeline = TraceTimeline;
    }

    export class BundleSettings extends Base {

        static Kiosk(): Promise<object> {
            console.warn("BundleSettings.Kiosk will be deprecated in the future, use Settings.KioskSettings instead");
            return Settings.KioskSettings();
        }

        static Store(): Promise<object> {
            console.warn("BundleSettings.Store will be deprecated in the future, use Settings.StoreSettings instead");
            return Settings.StoreSettings();
        }

        static App(): Promise<object> {
            console.warn("BundleSettings.App will be deprecated in the future, use Settings.BundleSettings instead");
            return Settings.BundleSettings();
        }

        static OnAppSettingsChanged(callback: (payload?: any) => void) {
            console.warn("BundleSettings.OnAppSettingsChanged will be deprecated in the future, use BundleSettingsCallbacks.BundlesettingsChanged instead");
            BundleSettingsCallbacks.BundlesettingsChanged(callback);
        }
    }

    export class Settings extends Base {

        static KioskSettings(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetKioskSettings").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static StoreSettings(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetStoreSettings").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static BundleSettings(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetBundleSettingsLive").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GetToken(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetToken").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GetCapabilities(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("Capabilities").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static AppDetails(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetAppDetails").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class BundleSettingsCallbacks extends Base {

        static BundlesettingsChanged(callback: (payload?: any) => void) {
            CallbacksManager.On("BundlesettingsChanged", callback);
        }

        static KioskSettingsChanged(callback: (payload?: any) => void) {
            CallbacksManager.On("KioskSettingsChanged", callback);
        }

        static StoreSettingsChanged(callback: (payload?: any) => void) {
            CallbacksManager.On("StoreSettingsChanged", callback);
        }
    }

    export class Sharing extends Base {

        static Register(name: string): Promise<boolean> {
            console.warn("Sharing.Register will be deprecated in the future, use Tweet.Register instead");
            return Tweet.Register(name);
        }

        static Discover(friendApps: SharedFriendApp[]): Promise<object> {
            console.warn("Sharing.Discover will be deprecated in the future, use Tweet.Discover instead");
            return Tweet.Discover(friendApps);
        }

        static Message(destination: FoundFriendApp, message: string, waitForAnswer: boolean): Promise<object> {
            console.warn("Sharing.Message will be deprecated in the future, use Tweet.NewMessage instead");
            return Tweet.NewMessage(destination, message, waitForAnswer);
        }

        static OnNewMessage(callback: (payload?: any) => void) {
            console.warn("Sharing.OnNewMessage will be deprecated in the future, use TweetCallbacks.OnNewMessage instead");
            TweetCallbacks.OnNewMessage(callback);
        }
    }

    export class Tweet extends Base {

        static Discover(friendApps: SharedFriendApp[]): Promise<object> {
            return new Promise((resolve, reject) => {
                if (friendApps == null || friendApps.length === 0) {
                    reject("Friend apps cannot be empty!");
                    return;
                }

                Base.executeString("Discover", JSON.stringify(friendApps)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static DiscoverByTopic(topics: string[]): Promise<object> {
            return new Promise((resolve, reject) => {
                if (topics == null || topics.length === 0) {
                    reject("Topics cannot be empty!");
                    return;
                }

                Base.executeString("DiscoverByTopic", JSON.stringify(topics)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static NewMessage(destination: FoundFriendApp, message: string, waitForAnswer: boolean): Promise<object> {
            return new Promise((resolve, reject) => {

                // check if the message is a json format
                try {
                    JSON.parse(message);
                } catch (ex) {
                    reject("The message has to be a stringified JSON.");
                    return;
                }

                var obj: any = {
                    Destination: destination,
                    Message: message,
                    WaitForAnswer: waitForAnswer
                };

                Base.executeString("Message", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    if (waitForAnswer)
                        resolve(response.Result);
                    else {
                        resolve(true);
                    }
                });
            });
        }

        static Register(name: string, topics?: string[]): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (name == null || name.length === 0) {
                    reject("Name cannot be null or empty");
                    return;
                }

                if (topics && topics.length > 0) {
                    var obj: any = {
                        Context: name,
                        Topics: topics
                    };

                    Base.executeString("RegisterWithTopics", JSON.stringify(obj)).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(true);
                    });
                } else {
                    Base.executeString("Register", name).then((response: ISdkResponse) => {
                        if (response.Error) {
                            reject(response.Error);
                            return;
                        }
                        resolve(true);
                    });
                }
            });
        }
    }

    export class TweetCallbacks extends Base {

        static OnNewMessage(callback: (payload?: any) => void) {
            CallbacksManager.On("NewMessage", callback);
        }
    }

    export class SharingCallbacks extends Base {

        static NewMessage(callback: (payload?: any) => void) {
            console.warn("SharingCallbacks.OnNewMessage will be deprecated in the future, use TweetCallbacks.OnNewMessage instead");
            TweetCallbacks.OnNewMessage(callback);
        }
    }

    export class Wings extends Base {

        static Status(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("WingsStatus").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Subscribe(topic: string): Promise<boolean> {
            return this.SubscribeTopics([topic]);
        }

        static SubscribeTopics(topics: string[]): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (topics == null || topics.length === 0) {
                    reject("Topic names cannot be empty");
                    return;
                }

                var obj: any = {
                    Topics: topics
                };

                Base.executeString("SubscribeTopics", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static Unsubscribe(name: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (name == null || name.length === 0) {
                    reject("Topic name cannot be null or empty!");
                    return;
                }

                Base.executeString("Unsubscribe", name).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static Publish(message: string, topic: string, id: string): Promise<boolean> {
            return new Promise((resolve, reject) => {
                if (topic == null || topic.length === 0) {
                    reject("Topic name cannot be null or empty!");
                    return;
                }

                // check if the message is a json format
                try {
                    JSON.parse(message);
                } catch (ex) {
                    reject("The message has to be a stringified JSON.");
                    return;
                }

                var obj: any = {
                    Topic: topic,
                    Message: message,
                    Id: id
                };

                Base.executeString("Publish", JSON.stringify(obj)).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(true);
                });
            });
        }

        static OnNewMessage(callback: (payload?: any) => void) {
            console.warn("Wings.OnNewMessage will be deprecated in the future, use WingsCallbacks.NewMessage instead");
            WingsCallbacks.NewMessage(callback);
        }
    }

    export class WingsCallbacks extends Base {

        static NewMessage(callback: (payload?: any) => void) {
            CallbacksManager.On("WingsNewMessage", callback);
        }
    }

    export class ConsumptionCallbacks extends Base {

        static Warning(callback: (payload?: any) => void) {
            CallbacksManager.On("ConsumptionCallbacks.Warning", callback);
        }

        static LastCall(callback: (payload?: any) => void) {
            CallbacksManager.On("ConsumptionCallbacks.LastCall", callback);
        }
    }

    export class Environment extends Base {

        static About(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetEnvironmentAbout").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Tags(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("Tags").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static StoreTags(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("StoreTags").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static WorkingHours(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetWorkingHours").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Shutdown(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("Shutdown").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
        static PrepareForShutdown(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("PrepareForShutdown").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
        static SetDisplaysBrightness(value: number): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("BrightnessLevel is invalid");
                    return;
                }

                if (value < 0 || value > 100) {
                    reject("BrightnessLevel must be between 0-100");
                    return;
                }

                Base.executeNumber("SetDisplaysBrightness", value).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
        static DeviceIP(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("DeviceIP").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
        static IsInWorkingHours(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("IsInWorkingHours").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static GeoLocation(): Promise<object> {
            console.warn("Environment.GeoLocation will be deprecated in the future, use GeoLocation.Current instead");
            return GeoLocation.Current();
        }

        static SetProtectionLockOnRestart(value: boolean): Promise<object> {
            return new Promise((resolve, reject) => {
                if (value == null) {
                    reject("IsLocked is invalid. Must be true or false");
                    return;
                }

                var IsLocked = value ? 1 : 0;

                Base.executeNumber("SetProtectionLockOnRestart", IsLocked).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class EventTriggers extends Base {

        static Register(events: string[]): Promise<object> {
            return new Promise((resolve, reject) => {
                if (events == null || events.length == 0) {
                    reject("events lists is empty");
                    return;
                }

                Base.executeString("EventsRegister", JSON.stringify({ events: events })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Unregister(events: string[]): Promise<object> {
            return new Promise((resolve, reject) => {

                if (events == null || events.length == 0) {
                    reject("events lists is empty");
                    return;
                }

                Base.executeString("EventTriggers.Unregister", JSON.stringify({ events: events })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static List(): Promise<object> {
            return new Promise((resolve, reject) => {

                Base.executeCommand("EventsList").then((response: ISdkResponse) => {
                    if (response.Error) {
                        var eventsNames: string[] = [];

                        for (var event in RegisteredEventType) {
                            var name = RegisteredEventType[event];

                            if (name.length > 2)
                                eventsNames.push(name);
                        }

                        resolve(eventsNames);
                        return;
                    }

                    resolve(response.Result.Events);
                });


            });
        }

        static OnEventRaised(callback: (payload?: any) => void): number {
            return CallbacksManager.On("EventRaised", callback);
        }

        static UnsubscribeCallback(identifier: number): void {
            return CallbacksManager.Off("EventRaised", identifier);
        }
    }

    export class GeoLocation extends Base {

        static Current(): Promise<object> {
            return new Promise((resolve, reject) => {
                Base.executeCommand("GetEnvironmentGeoLocation").then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

    }

    export class Directory extends Base {

        static Create(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("Directory.Create", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Delete(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("Directory.Delete", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static MoveTo(path: string, newPath: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                if (newPath == null || newPath.length === 0) {
                    reject("new path is empty");
                    return;
                }

                Base.executeIoCommand("Directory.MoveTo", JSON.stringify({ Path: path, NewPath: newPath })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Size(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("Directory.Size", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static List(path: string, filter?: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("Directory.List", JSON.stringify({ Path: path, Filter: filter })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    export class File extends Base {

        static Size(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.Size", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Delete(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.Delete", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Read(path: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.Read", JSON.stringify({ Path: path })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static Write(path: string, content: string, append: boolean = false): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.Write", JSON.stringify({ Path: path, TextContent: content, IsAppend: append })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static WriteBytes(path: string, content: any): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                var jssdkUrl = window["JSSDKUrl"] as string;

                var xhr = new XMLHttpRequest();
                xhr.open("POST", jssdkUrl + "/jssdk/upload", true);
                xhr.setRequestHeader("Path", path);

                xhr.onload = () => {
                    // Request finished. Do processing here.
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var responseParsed: ISdkResponse;

                        try {
                            responseParsed = JSON.parse(xhr.response);
                        } catch (ex) {
                            responseParsed = xhr.response;
                        }

                        if (responseParsed.Error) {
                            reject(responseParsed.Error);
                            return;
                        }
                        resolve(responseParsed.Result);
                    };
                };

                xhr.onerror = () => reject(xhr.statusText);
                xhr.send(content);
            });
        }

        static MoveTo(path: string, newPath: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                if (newPath == null || newPath.length === 0) {
                    reject("new path is empty");
                    return;
                }

                Base.executeIoCommand("File.MoveTo", JSON.stringify({ Path: path, NewPath: newPath })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static CopyTo(path: string, newPath: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }

                if (newPath == null || newPath.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.CopyTo", JSON.stringify({ Path: path, NewPath: newPath })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }

        static DownloadUrlTo(path: string, url: string): Promise<object> {
            return new Promise((resolve, reject) => {
                if (path == null || path.length === 0) {
                    reject("path is empty");
                    return;
                }
                if (url == null || url.length === 0) {
                    reject("path is empty");
                    return;
                }

                Base.executeIoCommand("File.DownloadUrlTo", JSON.stringify({ Path: path, Url: url })).then((response: ISdkResponse) => {
                    if (response.Error) {
                        reject(response.Error);
                        return;
                    }
                    resolve(response.Result);
                });
            });
        }
    }

    class CallbacksManager {

        private static callbacks: any = {};

        static On(message: string, callback: (payload?: any) => void): number {
            var msg: ICallback = this.callbacks[message] || <ICallback>(this.callbacks[message] = new Callback(message));
            return msg.subscribe(callback);
        }

        static Off(message: string, token: number) {
            if (this.callbacks[message]) {
                (<ICallback>(this.callbacks[message])).unSubscribe(token);
            }
        }

        static Trigger(message: string, payload?: any) {
            if (this.callbacks[message]) {
                (<ICallback>(this.callbacks[message])).notify(payload);
            }
        }
    }

    class Subscription {
        constructor(
            public id: number,
            public callback: (payload?: any) => void) {
        }
    }

    export class SharedFriendApp {
        constructor(
            public AppIdentifier: string,
            public Context: string) {
        }
    }

    export class FoundFriendApp {
        constructor(
            public AppIdentifier: string,
            public Context: string,
            public EntityIp: string) {
        }
    }

    interface ICallback {
        subscribe(callback: (payload?: any) => void): number;
        unSubscribe(id: number): void;
        notify(payload?: any): void;
    }

    class Callback implements ICallback {

        private subscriptions: Subscription[];
        private nextId: number;

        constructor(public callback: string) {
            this.subscriptions = [];
            this.nextId = 0;
        }

        public subscribe(callback: (payload?: any) => void) {
            var subscription = new Subscription(this.nextId++, callback);
            this.subscriptions[subscription.id] = subscription;
            return subscription.id;
        }

        public unSubscribe(id: number) {
            this.subscriptions[id] = undefined;
        }

        public notify(payload?: any) {
            for (var index = 0; index < this.subscriptions.length; index++) {
                if (this.subscriptions[index]) {
                    this.subscriptions[index].callback(payload);
                }
            }
        }
    }

    export enum NotificationType {
        Message,
        HtmlFile,
        HtmlContent,
        WarningMessage,
        InfoMessage
    }

    export enum IOBoardCommandType {
        OpenPrinterDoor,
        OpenMaintenanceDoor,
        OpenAdditionalDoor,
        SetSemaphoreOK,
        SetSemaphoreNOK,
        OpenBarrier,
        SetCustomerJourneyPaymentON, // isBlinking
        SetCustomerJourneyPaymentOFF,
        SetCustomerJourneyPrinterON, // isBlinking
        SetCustomerJourneyPrinterOFF,
        SetCustomerJourneyScannerON, // isBlinking
        SetCustomerJourneyScannerOFF,
        SetBlinkStickOFF,
        SetBlinkStickON // isBlinking & color
    }

    export enum UIAlignment {
        TopLeft,
        TopCenter,
        TopRight,
        MiddleLeft,
        MiddleCenter,
        MiddleRight,
        BottomLeft,
        BottomCenter,
        BottomRight,
        Hide
    }

    export enum PaymentCommandType {
        CardPreAuthorization,
        CardBalanceQuery,
        DebitValueFromCard,
        StoreValueInCard,
        CreateWashCode,
        RegisterNIT,
        ConfirmPrePayment,
        DisplayMessage,
        RequestInput
    }

    enum RegisteredEventType {
        IOboard_CustomerDetected,
        IOboard_KeyAccessUsed,
        IOboard_AdditionalDoorStateChanged,
        IOboard_MaintenanceDoorStateChanged,
        IOboard_PrinterDoorStateChanged,
        MagReader_DataRead,
        Scanner_Scanned,
        Kiosk_OutOfWorkingHours_Started,
        Kiosk_OutOfWorkingHours_Ended
    }

    export enum PaymentTransactionType {
        Pay,
        Authorization,
        Record,
        Gift,
        Loyalty
    }

    export interface IJavaScriptSdkHandler {
        executeWithNumber(command: string, value: number, resolve: (response: any) => any): Promise<string>;
        executeWithString(command: string, content: string, resolve: (response: any) => any): Promise<string>;
        executeWithCommand(command: string, resolve: (response: any) => any): Promise<string>;
        executeIoCommand(command: string, parameters: string, content: any, resolve: (response: any) => any): Promise<string>;
    }
    interface ISdkResponse {
        Error: string;
        Description: string;
        Result: any;
    }

    interface IEndPaymentSdkResponse extends ISdkResponse {
        PaidAmount: number;
        RefundAmount: number;
    }
}

interface IMyWindow extends Window {
    JavaScriptSdkHandlerFullAsync: MBirdSdk.IJavaScriptSdkHandler;
    JSSDKUrl: string;
}

export default MBirdSdk;
