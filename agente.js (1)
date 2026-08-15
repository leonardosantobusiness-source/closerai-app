// =====================================
// CLOSERAI - AGENTE IA
// =====================================

const agenteForm = document.getElementById("agenteForm");


// =====================================
// ELEMENTOS
// =====================================

const nomeIA =
    document.getElementById("nomeIA");

const personalidade =
    document.getElementById("personalidade");

const categoria =
    document.getElementById("categoria");

const descricao =
    document.getElementById("descricao");

const produtos =
    document.getElementById("produtos");

const moeda =
    document.getElementById("moeda");

const site =
    document.getElementById("site");

const perguntas =
    document.getElementById("perguntas");

const objetivo =
    document.getElementById("objetivo");

const mensagemIA =
    document.getElementById("mensagemIA");

const canalWhatsapp =
    document.getElementById("canalWhatsapp");

const canalTelegram =
    document.getElementById("canalTelegram");

const canalInstagram =
    document.getElementById("canalInstagram");

const canalWebsite =
    document.getElementById("canalWebsite");


// =====================================
// EMPRESA
// =====================================

const empresaId =
    localStorage.getItem("empresaId");


if (!empresaId) {

    if (mensagemIA) {

        mensagemIA.innerHTML =
            "❌ Empresa não encontrada. Faça login novamente.";

    }

}


// =====================================
// CARREGAR IA
// =====================================

async function carregarIA() {

    if (!empresaId) return;


    mensagemIA.innerHTML =
        "⏳ A carregar dados da IA...";


    const {
        data,
        error
    } = await supabaseClient

        .from("conhecimento")

        .select("*")

        .eq(
            "empresa_id",
            empresaId
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        )

        .limit(1);


    if (error) {

        console.error(
            "❌ Erro ao carregar IA:",
            error
        );

        mensagemIA.innerHTML =
            "❌ Não foi possível carregar os dados da IA.";

        return;

    }


    // =====================================
    // NENHUM CONHECIMENTO
    // =====================================

    if (!data || data.length === 0) {

        mensagemIA.innerHTML =
            "🟡 Configure a sua IA e clique em Treinar.";

        return;

    }


    const conhecimento =
        data[0];


    console.log(
        "🧠 Conhecimento carregado:",
        conhecimento
    );


    // =====================================
    // PREENCHER CAMPOS
    // =====================================

    nomeIA.value =
        conhecimento.nome_ia || "";


    personalidade.value =
        conhecimento.personalidade ||
        "Profissional";


    categoria.value =
        conhecimento.categoria ||
        "E-commerce";


    descricao.value =
        conhecimento.descricao_empresa ||
        "";


    produtos.value =
        conhecimento.produtos ||
        "";


    moeda.value =
        conhecimento.moeda ||
        "USD";


    site.value =
        conhecimento.site ||
        "";


    perguntas.value =
        conhecimento.perguntas ||
        "";


    objetivo.value =
        conhecimento.objetivo ||
        "Vender produtos";


    // =====================================
    // CANAIS
    // =====================================

    const canais =
        String(
            conhecimento.canais || ""
        ).toLowerCase();


    canalWhatsapp.checked =
        canais.includes("whatsapp");


    canalTelegram.checked =
        canais.includes("telegram");


    canalInstagram.checked =
        canais.includes("instagram");


    canalWebsite.checked =
        canais.includes("website");


    mensagemIA.innerHTML =
        "🟢 Dados da IA carregados.";

}


// =====================================
// OBTER CANAIS
// =====================================

function obterCanais() {

    const canais = [];


    if (canalWhatsapp.checked) {

        canais.push(
            "WhatsApp"
        );

    }


    if (canalTelegram.checked) {

        canais.push(
            "Telegram"
        );

    }


    if (canalInstagram.checked) {

        canais.push(
            "Instagram"
        );

    }


    if (canalWebsite.checked) {

        canais.push(
            "Website"
        );

    }


    return canais.join(", ");

}


// =====================================
// SALVAR / ATUALIZAR IA
// =====================================

if (agenteForm) {

    agenteForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            if (!empresaId) {

                mensagemIA.innerHTML =
                    "❌ Empresa não encontrada.";

                return;

            }


            mensagemIA.innerHTML =
                "⏳ A guardar configuração da IA...";


            // =================================
            // DADOS
            // =================================

            const dados = {

                empresa_id:
                    empresaId,

                nome_ia:
                    nomeIA.value.trim(),

                personalidade:
                    personalidade.value,

                categoria:
                    categoria.value,

                descricao_empresa:
                    descricao.value.trim(),

                produtos:
                    produtos.value.trim(),

                moeda:
                    moeda.value,

                site:
                    site.value.trim(),

                perguntas:
                    perguntas.value.trim(),

                objetivo:
                    objetivo.value,

                canais:
                    obterCanais()

            };


            console.log(
                "📦 Dados da IA:",
                dados
            );


            try {

                // =================================
                // VERIFICAR SE JÁ EXISTE
                // =================================

                const {
                    data: existente,
                    error: erroBusca
                } = await supabaseClient

                    .from("conhecimento")

                    .select("id")

                    .eq(
                        "empresa_id",
                        empresaId
                    )

                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )

                    .limit(1);


                if (erroBusca) {

                    throw erroBusca;

                }


                // =================================
                // ATUALIZAR
                // =================================

                if (
                    existente &&
                    existente.length > 0
                ) {

                    const id =
                        existente[0].id;


                    const {
                        error: erroUpdate
                    } = await supabaseClient

                        .from("conhecimento")

                        .update(dados)

                        .eq(
                            "id",
                            id
                        );


                    if (erroUpdate) {

                        throw erroUpdate;

                    }


                    mensagemIA.innerHTML =
                        "✅ Configuração da IA atualizada com sucesso!";

                }


                // =================================
                // CRIAR
                // =================================

                else {

                    const {
                        error: erroInsert
                    } = await supabaseClient

                        .from("conhecimento")

                        .insert([
                            dados
                        ]);


                    if (erroInsert) {

                        throw erroInsert;

                    }


                    mensagemIA.innerHTML =
                        "🚀 IA treinada com sucesso!";

                }


                console.log(
                    "✅ Configuração salva."
                );


            } catch (error) {

                console.error(
                    "❌ Erro ao salvar IA:",
                    error
                );


                mensagemIA.innerHTML =
                    "❌ Erro ao salvar: " +
                    error.message;

            }

        }
    );

}


// =====================================
// INICIAR
// =====================================

carregarIA();