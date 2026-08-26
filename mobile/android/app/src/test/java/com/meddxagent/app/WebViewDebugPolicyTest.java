package com.meddxagent.app;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class WebViewDebugPolicyTest {
    @Test
    public void releaseBuildDisablesWebViewDebugging() {
        assertFalse(WebViewDebugPolicy.isEnabled(false));
    }

    @Test
    public void debugBuildCanEnableWebViewDebugging() {
        assertTrue(WebViewDebugPolicy.isEnabled(true));
    }
}
