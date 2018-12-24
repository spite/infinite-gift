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

  if (device instanceof XRDevice) {
    if (currentSession === null) {

      device.requestSession({ immersive: true, exclusive: true /* DEPRECATED */ }).then(onSessionStarted);

    } else {

      currentSession.end();

    }
  }

  renderer.vr.setDevice(device);

}

export { detectWebXR, startWebXR }