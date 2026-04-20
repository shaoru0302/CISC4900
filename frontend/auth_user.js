function updateNavbarAndUserPage() {
  fetch("/api/me")
    .then(res => res.json())
    .then(data => {
      // auth login navbar
      const authLink = document.getElementById("authLink");

      if (authLink) {
        if (data.loggedIn) {
          const dashboardLink =
            data.role === "admin" ? "/admin" : "/user";

          authLink.innerHTML = `
            <a href="${dashboardLink}">Hi, ${data.displayName || "User"}</a>
            <a href="/logout" style="margin-left:10px;">Logout</a>
          `;
        } else {
          authLink.innerHTML = `<a href="/auth/google">Login</a>`;
        }
      }

      // user page welcome
      const welcome = document.getElementById("welcomeText");

      if (welcome) {
        if (!data.loggedIn) {
          window.location.href = "/";
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