package com.meddxagent.app;

final class WebViewDebugPolicy {
    private WebViewDebugPolicy() {}

    static boolean isEnabled(boolean debugBuild) {
        return debugBuild;
    }
}
