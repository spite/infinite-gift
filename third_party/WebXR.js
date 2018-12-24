function detectWebXR() {

  if ('xr' in navigator) {

    return new Promise((resolve, reject) => {
      navigator.xr.requestDevice().then(function(device) {

        device.supportsSession({ immersive: true, exclusive: true /* DEPRECATED */ })
          .then(() => resolve(device))
          .catch(() => reject());

      }).catch(() => reject());
    })

  }

  if ('getVRDisplays' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.getVRDisplays()
        .then(function(displays) {

          if (displays.length > 0) {

            resolve(displays[0]);

          } else {

            reject();

          }

        }).catch(() => reject());
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
    session.addEventListener('end', onSessionEnded);
    renderer.vr.setSession(session);
    currentSession = session;
  }

  function onSessionEnded(event) {
    currentSession.removeEventListener('end', onSessionEnded);
    renderer.vr.setSession(null);
    currentSession = null;
  }

  try {
    if (device instanceof XRDevice) {
      if (currentSession === null) {
        device.requestSession({ immersive: true, exclusive: true /* DEPRECATED */ }).then(onSessionStarted);
      } else {
        currentSession.end();
      }
    }
  } catch (e) {

  }

  try {
    if (device instanceof VRDisplay) {
      device.isPresenting ? device.exitPresent() : device.requestPresent([{ source: renderer.domElement }]);
    }
  } catch (e) {}
  renderer.vr.setDevice(device);
}


export { detectWebXR, startWebXR }