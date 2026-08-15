// =====================================
// CLOSERAI AUTH
// =====================================

const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {

    cadastroForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const empresa = document.getElementById("empresa").value;
        const senha = document.getElementById("senha").value;

        const mensagem = document.getElementById("mensagem");

        mensagem.innerHTML = "Criando conta...";

        // Criar utilizador

        const { data, error } = await supabaseClient.auth.signUp({

            email: email,
            password: senha

        });

        if(error){

            mensagem.innerHTML = error.message;
            return;

        }

        // Guardar empresa

        const { error: erroEmpresa } = await supabaseClient

        .from("empresas")

        .insert([{

            nome_empresa: empresa

        }]);

        if(erroEmpresa){

            mensagem.innerHTML = erroEmpresa.message;
            return;

        }

        mensagem.innerHTML = "Conta criada com sucesso!";

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1500);

    });

}