export type ScriptLoadOptions = {
    /** Script URL. */
    src: string;
    /** `id` attribute of the `<script>` tag. */
    id: string;
    /** Extra attempts after the first failed one. */
    retries?: number;
    /** Pause between attempts, ms. */
    retryDelay?: number;
    /**
     * How long to wait for `load`/`error` of a `<script>` tag, ms: a stalled request
     * (no answer from the server, captive portal) fails the attempt instead of hanging.
     * The same timeout is used for a tag inserted by someone else.
     */
    timeout?: number;
};
export declare const DEFAULT_RETRIES = 2;
export declare const DEFAULT_RETRY_DELAY = 1000;
export declare const DEFAULT_TIMEOUT = 15000;
/**
 * Loads Kinescope IFrame API once per page.
 * All callers share one promise, so every waiting player gets either success or the error.
 * After a failure the state is reset and the next call loads the script again.
 */
export declare function loadIframeApi(options: ScriptLoadOptions): Promise<void>;
/** @internal For tests only. */
export declare function resetIframeApiLoader(): void;
