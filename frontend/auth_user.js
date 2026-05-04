if (typeof window.BEAUTYNEST_API_ORIGIN === "undefined") {
  window.BEAUTYNEST_API_ORIGIN =
    window.location.protocol === "file:" ? "http://127.0.0.1:4900" : "";
}

const API_ORIGIN = window.BEAUTYNEST_API_ORIGIN || "";

function updateNavbarAndUserPage() {
  fetch(`${API_ORIGIN}/api/me`)
    .then((res) => res.json())
    .then((data) => {
      const authLink = document.getElementById("authLink");

      if (authLink) {
        if (data.loggedIn) {
          const dashboardLink =
            data.role === "admin"
              ? `${API_ORIGIN}/admin`
              : `${API_ORIGIN}/user`;

          authLink.innerHTML = `
            <a href="${dashboardLink}">Hi, ${data.displayName || "User"}</a>
            <a href="${API_ORIGIN}/logout" style="margin-left:10px;">Logout</a>
          `;
        } else {
          authLink.innerHTML = `<a href="${API_ORIGIN}/auth/google">Login</a>`;
        }
      }

      const welcome = document.getElementById("welcomeText");

      if (welcome) {
        if (!data.loggedIn) {
          window.location.href = `${API_ORIGIN}/`;
          return;
        }

        welcome.innerText =
          "Welcome " + (data.displayName || data.email || "User");
      }
    })
    .catch(() => {
      console.log("auth check failed");
    });
}

document.addEventListener("DOMContentLoaded", updateNavbarAndUserPage);
