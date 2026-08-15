// =========================================
// CLOSERAI - CADASTRO
// =========================================

const formulario = document.getElementById("cadastroForm");

if (formulario) {

    formulario.addEventListener("submit", async function (e) {

        e.preventDefault();

        const empresa = document.getElementById("empresa").value.trim();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        const mensagem = document.getElementById("mensagem");

        mensagem.innerHTML = "Criando conta...";

        // Criar empresa

        const { data: empresaData, error: empresaError } = await supabaseClient
            .from("empresas")
            .insert([
                {
                    nome_empresa: empresa
                }
            ])
            .select();

        if (empresaError) {

            mensagem.innerHTML = empresaError.message;
            console.log(empresaError);

            return;

        }

        const empresaId = empresaData[0].id;

        // Criar utilizador

        const { error: usuarioError } = await supabaseClient
            .from("usuarios")
            .insert([
                {
                    empresa_id: empresaId,
                    nome: nome,
                    email: email,
                    senha: senha,
                    cargo: "Administrador"
                }
            ]);

        if (usuarioError) {

            mensagem.innerHTML = usuarioError.message;
            console.log(usuarioError);

            return;

        }

        localStorage.setItem("empresaId", empresaId);
        localStorage.setItem("empresaNome", empresa);
        localStorage.setItem("usuarioNome", nome);

        mensagem.innerHTML = "Conta criada com sucesso!";

        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 1000);

    });

}