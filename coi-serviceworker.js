/*! coi-serviceworker v0.1.7 - Guido Zuidhof, MIT License */
let coepCredentialless = false;
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
    self.addEventListener("message", (ev) => {
        if (ev.data && ev.data.type === "deregister") {
            self.registration.unregister().then(() => self.clients.matchAll()).then(clients => {
                clients.forEach(client => client.navigate(client.url));
            });
        }
    });
    self.addEventListener("fetch", function (event) {
        const request = event.request;
        if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;
        event.respondWith(
            fetch(request).then((response) => {
                if (response.status === 0) return response;
                const newHeaders = new Headers(response.headers);
                newHeaders.set("Cross-Origin-Embedder-Policy", coepCredentialless ? "credentialless" : "require-corp");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });
            })
        );
    });
} else {
    (() => {
        const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf");
        window.sessionStorage.removeItem("coiReloadedBySelf");
        if (window.crossOriginIsolated) return;
        const currentScript = document.currentScript;
        const n = navigator;
        if (n.serviceWorker) {
            n.serviceWorker.register(currentScript.src).then((registration) => {
                registration.addEventListener("updatefound", () => {
                    window.sessionStorage.setItem("coiReloadedBySelf", "true");
                    window.location.reload();
                });
                if (registration.active && !n.serviceWorker.controller) {
                    window.sessionStorage.setItem("coiReloadedBySelf", "true");
                    window.location.reload();
                }
            });
        }
    })();
}