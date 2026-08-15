// =====================================
// CLOSERAI - VENDAS
// =====================================

document.addEventListener("DOMContentLoaded", async function () {

    const lista = document.getElementById("vendasLista");
    const mensagem = document.getElementById("vendasMensagem");

    const receitaTotal = document.getElementById("receitaTotal");
    const vendasHoje = document.getElementById("vendasHoje");
    const conversao = document.getElementById("conversao");
    const ticketMedio = document.getElementById("ticketMedio");


    // =====================================
    // ID DA EMPRESA
    // =====================================

    const empresaId =
        localStorage.getItem("empresaId");


    console.log("=================================");
    console.log("CLOSERAI - CENTRO DE VENDAS");
    console.log("=================================");
    console.log("Empresa:", empresaId);


    // =====================================
    // VERIFICAR EMPRESA
    // =====================================

    if (!empresaId) {

        lista.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#ef4444;
                    ">
                    🔴 Empresa não encontrada.
                </td>
            </tr>
        `;

        mensagem.innerHTML =
            "Nenhuma empresa está guardada neste navegador.";

        return;
    }


    mensagem.innerHTML =
        "⏳ A carregar vendas...";


    // =====================================
    // BUSCAR VENDAS
    // =====================================

    const { data: vendas, error } =
        await supabaseClient
            .from("vendas")
            .select("*")
            .eq("empresa_id", empresaId)
            .order("created_at", {
                ascending: false
            });


    console.log("🏢 Empresa pesquisada:", empresaId);

    console.log("💰 Vendas encontradas:", vendas);

    console.log("❌ Erro:", error);


    // =====================================
    // ERRO
    // =====================================

    if (error) {

        console.error(
            "❌ Erro Supabase:",
            error
        );

        lista.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#ef4444;
                    ">
                    ❌ Erro ao carregar vendas.
                </td>
            </tr>
        `;

        mensagem.innerHTML =
            "❌ " + error.message;

        return;
    }


    // =====================================
    // NENHUMA VENDA
    // =====================================

    if (!vendas || vendas.length === 0) {

        console.warn(
            "⚠️ Nenhuma venda encontrada."
        );

        lista.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#94a3b8;
                    ">
                    🛒 Nenhuma venda encontrada.
                </td>
            </tr>
        `;


        receitaTotal.innerHTML =
            "$0.00";

        vendasHoje.innerHTML =
            "0";

        conversao.innerHTML =
            "0%";

        ticketMedio.innerHTML =
            "$0.00";


        mensagem.innerHTML =
            "Nenhuma venda encontrada para a empresa: " +
            empresaId;

        return;
    }


    // =====================================
    // RECEITA TOTAL
    // =====================================

    let total = 0;


    vendas.forEach(function (venda) {

        total +=
            Number(venda.valor) || 0;

    });


    // =====================================
    // DATA DE HOJE
    // =====================================

    const agora = new Date();

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");


    const hoje =
        `${ano}-${mes}-${dia}`;


    // =====================================
    // VENDAS DE HOJE
    // =====================================

    const vendasHojeLista =
        vendas.filter(function (venda) {

            if (!venda.created_at) {
                return false;
            }

            return venda.created_at
                .startsWith(hoje);

        });


    // =====================================
    // TICKET MÉDIO
    // =====================================

    const media =
        total / vendas.length;


    // =====================================
    // BUSCAR CLIENTES
    // =====================================

    const {
        count: totalClientes,
        error: clientesError
    } = await supabaseClient

        .from("clientes")

        .select("*", {
            count: "exact",
            head: true
        })

        .eq(
            "empresa_id",
            empresaId
        );


    console.log(
        "👥 Total clientes:",
        totalClientes
    );


    if (clientesError) {

        console.warn(
            "⚠️ Não foi possível contar clientes:",
            clientesError
        );

    }


    // =====================================
    // CONVERSÃO
    // =====================================

    let taxaConversao = 0;


    if (
        totalClientes &&
        totalClientes > 0
    ) {

        taxaConversao =
            (
                vendas.length /
                totalClientes
            ) * 100;

    }


    // =====================================
    // ATUALIZAR CARDS
    // =====================================

    receitaTotal.innerHTML =
        "$" + total.toFixed(2);


    vendasHoje.innerHTML =
        vendasHojeLista.length;


    conversao.innerHTML =
        taxaConversao.toFixed(1) + "%";


    ticketMedio.innerHTML =
        "$" + media.toFixed(2);


    // =====================================
    // LIMPAR TABELA
    // =====================================

    lista.innerHTML = "";


    // =====================================
    // MOSTRAR VENDAS
    // =====================================

    vendas.forEach(function (venda) {

        const tr =
            document.createElement("tr");


        const cliente =
            venda.cliente ||
            "Cliente";


        const produto =
            venda.produto ||
            "Produto";


        const valor =
            Number(venda.valor) || 0;


        const moeda =
            venda.moeda ||
            "USD";


        const estado =
            venda.status ||
            "Pendente";


        // =================================
        // ESTADO
        // =================================

        let estadoTexto =
            estado;


        const estadoNormalizado =
            estado
                .toString()
                .toLowerCase();


        if (
            estadoNormalizado === "concluída" ||
            estadoNormalizado === "concluida" ||
            estadoNormalizado === "paga" ||
            estadoNormalizado === "sucesso"
        ) {

            estadoTexto =
                "🟢 " + estado;

        }

        else if (
            estadoNormalizado === "pendente"
        ) {

            estadoTexto =
                "🟡 " + estado;

        }

        else if (
            estadoNormalizado === "cancelada" ||
            estadoNormalizado === "cancelado"
        ) {

            estadoTexto =
                "🔴 " + estado;

        }


        // =================================
        // DATA
        // =================================

        let dataVenda =
            "-";


        if (venda.created_at) {

            dataVenda =
                new Date(
                    venda.created_at
                ).toLocaleDateString(
                    "pt-PT"
                );

        }


        // =================================
        // LINHA
        // =================================

        tr.innerHTML = `

            <td style="padding:15px 8px;">
                ${cliente}
            </td>

            <td style="padding:15px 8px;">
                ${produto}
            </td>

            <td style="padding:15px 8px;">
                ${valor.toFixed(2)}
            </td>

            <td style="padding:15px 8px;">
                ${moeda}
            </td>

            <td style="padding:15px 8px;">
                ${estadoTexto}
            </td>

            <td style="padding:15px 8px;">
                ${dataVenda}
            </td>

        `;


        lista.appendChild(tr);

    });


    // =====================================
    // SUCESSO
    // =====================================

    mensagem.innerHTML =
        "🟢 Vendas carregadas com sucesso. " +
        vendas.length +
        " venda(s) encontrada(s).";


    console.log(
        "================================="
    );

    console.log(
        "✅ CENTRO DE VENDAS CARREGADO"
    );

    console.log(
        "💰 Total:",
        total
    );

    console.log(
        "🛒 Vendas:",
        vendas.length
    );

    console.log(
        "================================="
    );

});