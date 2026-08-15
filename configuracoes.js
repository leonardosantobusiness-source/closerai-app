// =====================================
// CLOSERAI - CONFIGURAÇÕES
// =====================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("⚙️ Configurações iniciadas");


    // =====================================
    // ELEMENTOS
    // =====================================

    const nomeEmpresa =
        document.getElementById("nomeEmpresa");

    const emailEmpresa =
        document.getElementById("emailEmpresa");

    const responsavelEmpresa =
        document.getElementById("responsavelEmpresa");

    const moedaEmpresa =
        document.getElementById("moedaEmpresa");

    const nomeIA =
        document.getElementById("nomeIA");

    const objetivoIA =
        document.getElementById("objetivoIA");

    const botaoSalvar =
        document.getElementById("salvarConfiguracoes");

    const mensagem =
        document.getElementById("configMensagem");


    // =====================================
    // EMPRESA ID
    // =====================================

    const empresaId =
        localStorage.getItem("empresaId");


    console.log(
        "🏢 Empresa ID:",
        empresaId
    );


    // =====================================
    // VERIFICAR EMPRESA
    // =====================================

    if (!empresaId) {

        mensagem.innerHTML =
            "🔴 Empresa não encontrada. Entre novamente na sua conta.";

        mensagem.style.color = "#ef4444";

        return;

    }


    mensagem.innerHTML =
        "⏳ A carregar configurações...";


    // =====================================
    // BUSCAR EMPRESA
    // =====================================

    const empresaResultado =
        await supabaseClient

            .from("empresas")

            .select("*")

            .eq("id", empresaId)

            .single();


    const empresa =
        empresaResultado.data;

    const erroEmpresa =
        empresaResultado.error;


    console.log(
        "🏢 Dados da empresa:",
        empresa
    );


    // =====================================
    // ERRO EMPRESA
    // =====================================

    if (erroEmpresa) {

        console.error(
            "❌ Erro empresa:",
            erroEmpresa
        );


        mensagem.innerHTML =
            "❌ Erro ao carregar empresa: " +
            erroEmpresa.message;

        mensagem.style.color = "#ef4444";

        return;

    }


    // =====================================
    // PREENCHER EMPRESA
    // =====================================

    if (empresa) {

        nomeEmpresa.value =
            empresa.nome_empresa || "";

        emailEmpresa.value =
            empresa.email || "";

        responsavelEmpresa.value =
            empresa.responsavel || "";

        moedaEmpresa.value =
            empresa.moeda || "USD";

    }


    // =====================================
    // BUSCAR IA
    // =====================================

    const iaResultado =
        await supabaseClient

            .from("conhecimento")

            .select("*")

            .eq("empresa_id", empresaId)

            .order("created_at", {
                ascending: false
            })

            .limit(1);


    const iaLista =
        iaResultado.data;

    const erroIA =
        iaResultado.error;


    console.log(
        "🤖 Dados da IA:",
        iaLista
    );


    // =====================================
    // PREENCHER IA
    // =====================================

    if (
        !erroIA &&
        iaLista &&
        iaLista.length > 0
    ) {

        nomeIA.value =
            iaLista[0].nome_ia || "CloserAI";

    }
    else {

        nomeIA.value =
            "CloserAI";

    }


    // =====================================
    // OBJETIVO
    // =====================================

    const objetivoGuardado =
        localStorage.getItem(
            "objetivoIA_" + empresaId
        );


    if (objetivoGuardado) {

        objetivoIA.value =
            objetivoGuardado;

    }


    // =====================================
    // INTEGRAÇÕES
    // =====================================

    mensagem.innerHTML =
        "🟢 Configurações carregadas.";

    mensagem.style.color = "#22c55e";


    // =====================================
    // SALVAR
    // =====================================

    botaoSalvar.addEventListener(
        "click",
        async function () {


            // =============================
            // VALORES
            // =============================

            const novoNomeEmpresa =
                nomeEmpresa.value.trim();

            const novoEmail =
                emailEmpresa.value.trim();

            const novoResponsavel =
                responsavelEmpresa.value.trim();

            const novaMoeda =
                moedaEmpresa.value;

            const novoNomeIA =
                nomeIA.value.trim();

            const novoObjetivo =
                objetivoIA.value;


            // =============================
            // VALIDAÇÃO
            // =============================

            if (!novoNomeEmpresa) {

                mensagem.innerHTML =
                    "⚠️ Digite o nome da empresa.";

                mensagem.style.color =
                    "#f59e0b";

                return;

            }


            if (!novoNomeIA) {

                mensagem.innerHTML =
                    "⚠️ Digite o nome da IA.";

                mensagem.style.color =
                    "#f59e0b";

                return;

            }


            // =============================
            // BOTÃO
            // =============================

            botaoSalvar.disabled =
                true;

            botaoSalvar.innerHTML =
                "⏳ A guardar...";


            mensagem.innerHTML =
                "⏳ A guardar alterações...";

            mensagem.style.color =
                "#94a3b8";


            // =============================
            // ATUALIZAR EMPRESA
            // =============================

            const atualizarEmpresa =
                await supabaseClient

                    .from("empresas")

                    .update({

                        nome_empresa:
                            novoNomeEmpresa,

                        email:
                            novoEmail,

                        responsavel:
                            novoResponsavel,

                        moeda:
                            novaMoeda

                    })

                    .eq(
                        "id",
                        empresaId
                    );


            if (
                atualizarEmpresa.error
            ) {

                console.error(
                    "❌ Erro ao atualizar empresa:",
                    atualizarEmpresa.error
                );


                mensagem.innerHTML =
                    "❌ Erro ao guardar empresa: " +
                    atualizarEmpresa.error.message;

                mensagem.style.color =
                    "#ef4444";


                botaoSalvar.disabled =
                    false;

                botaoSalvar.innerHTML =
                    "💾 Salvar Alterações";


                return;

            }


            // =============================
            // VERIFICAR SE EXISTE IA
            // =============================

            const iaAtual =
                await supabaseClient

                    .from("conhecimento")

                    .select("id")

                    .eq(
                        "empresa_id",
                        empresaId
                    )

                    .limit(1);


            if (
                iaAtual.error
            ) {

                console.error(
                    "❌ Erro ao verificar IA:",
                    iaAtual.error
                );

            }


            // =============================
            // ATUALIZAR IA
            // =============================

            if (
                iaAtual.data &&
                iaAtual.data.length > 0
            ) {


                const atualizarIA =
                    await supabaseClient

                        .from("conhecimento")

                        .update({

                            nome_ia:
                                novoNomeIA

                        })

                        .eq(
                            "id",
                            iaAtual.data[0].id
                        );


                if (
                    atualizarIA.error
                ) {

                    console.error(
                        "❌ Erro IA:",
                        atualizarIA.error
                    );


                    mensagem.innerHTML =
                        "⚠️ Empresa salva, mas houve um erro ao salvar a IA.";

                    mensagem.style.color =
                        "#f59e0b";

                }

            }

            else {


                // =========================
                // CRIAR CONFIGURAÇÃO DA IA
                // =========================

                const criarIA =
                    await supabaseClient

                        .from("conhecimento")

                        .insert({

                            empresa_id:
                                empresaId,

                            nome_ia:
                                novoNomeIA

                        });


                if (
                    criarIA.error
                ) {

                    console.error(
                        "❌ Erro ao criar IA:",
                        criarIA.error
                    );


                    mensagem.innerHTML =
                        "⚠️ Empresa salva, mas não foi possível criar a configuração da IA.";

                    mensagem.style.color =
                        "#f59e0b";

                }

            }


            // =============================
            // GUARDAR OBJETIVO
            // =============================

            localStorage.setItem(

                "objetivoIA_" +
                empresaId,

                novoObjetivo

            );


            // =============================
            // GUARDAR NOME LOCAL
            // =============================

            localStorage.setItem(
                "empresaNome",
                novoNomeEmpresa
            );


            // =============================
            // SUCESSO
            // =============================

            mensagem.innerHTML =
                "✅ Configurações salvas com sucesso!";

            mensagem.style.color =
                "#22c55e";


            botaoSalvar.disabled =
                false;

            botaoSalvar.innerHTML =
                "💾 Salvar Alterações";


            console.log(
                "✅ Configurações atualizadas."
            );

        }
    );

});