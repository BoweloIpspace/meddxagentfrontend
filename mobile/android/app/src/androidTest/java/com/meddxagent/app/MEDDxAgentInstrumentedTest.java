package com.meddxagent.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import android.content.Context;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class MEDDxAgentInstrumentedTest {
    @Test
    public void applicationIdentityMatchesProductionPackage() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.meddxagent.app", appContext.getPackageName());
    }

    @Test
    public void mainActivityIsPackaged() throws Exception {
        assertNotNull(Class.forName("com.meddxagent.app.MainActivity"));
    }
}
