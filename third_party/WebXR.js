function detectWebXR() {
  if ("xr" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.xr
        .isSessionSupported("immersive-vr")
        .then(supported => {
          resolve();
        })
        .catch(() => reject());
    });
  }

  throw new Error("No WebXR support.");
}

function startWebXR(device, renderer, options) {
  if (options && options.frameOfReferenceType) {
    renderer.vr.setFrameOfReferenceType(options.frameOfReferenceType);
  }

  let currentSession = null;

  function onSessionStarted(session) {
    session.addEventListener("end", onSessionEnded);
    renderer.vr.setSession(session);
    currentSession = session;
  }

  function onSessionEnded(event) {
    currentSession.removeEventListener("end", onSessionEnded);
    renderer.vr.setSession(null);
    currentSession = null;
  }

  var sessionInit = { optionalFeatures: ["local-floor", "bounded-floor"] };
  navigator.xr
    .requestSession("immersive-vr", sessionInit)
    .then(onSessionStarted);

  //renderer.vr.setDevice(device);
}

export { detectWebXR, startWebXR };
