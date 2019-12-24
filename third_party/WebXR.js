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

  if ("getVRDisplays" in navigator) {
    return new Promise((resolve, reject) => {
      navigator
        .getVRDisplays()
        .then(function(displays) {
          if (displays.length > 0) {
            resolve(displays[0]);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  }

  return null;
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
