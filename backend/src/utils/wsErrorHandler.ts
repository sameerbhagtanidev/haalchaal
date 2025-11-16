export default function wsErrorHandler(err: any, ack?: (res: any) => void) {
    ack?.({
        success: false,
        message: err.message || "Something went wrong",
    });
}
