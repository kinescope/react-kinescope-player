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
     * How long to wait for a `<script>` tag that was inserted by someone else
     * (an older wrapper version, a second copy of this package) before removing it, ms.
     */
    foreignTagTimeout?: number;
};
export declare const DEFAULT_RETRIES = 2;
export declare const DEFAULT_RETRY_DELAY = 1000;
export declare const DEFAULT_FOREIGN_TAG_TIMEOUT = 15000;
/**
 * Loads Kinescope IFrame API once per page.
 * All callers share one promise, so every waiting player gets either success or the error.
 * After a failure the state is reset and the next call loads the script again.
 */
export declare function loadIframeApi(options: ScriptLoadOptions): Promise<void>;
/** @internal For tests only. */
export declare function resetIframeApiLoader(): void;
