// =========================================
// CLOSERAI - LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const senha = document.getElementById("senha").value.trim();

        const mensagem = document.getElementById("mensagem");

        mensagem.innerHTML = "Entrando...";

        const { data, error } = await supabaseClient

        .from("usuarios")

        .select("*")

        .eq("email", email)

        .eq("senha", senha)

        .limit(1);

        if(error){

            mensagem.innerHTML = error.message;

            return;

        }

        if(data.length === 0){

            mensagem.innerHTML = "Email ou senha incorretos.";

            return;

        }

        localStorage.setItem("usuarioId", data[0].id);

        localStorage.setItem("empresaId", data[0].empresa_id);

        localStorage.setItem("usuarioNome", data[0].nome);

        mensagem.innerHTML = "Login realizado com sucesso!";

        setTimeout(function(){

            window.location.href="dashboard.html";

        },1000);

    });

}