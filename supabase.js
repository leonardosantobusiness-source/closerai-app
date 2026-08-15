// =================================
// CLOSERAI - SUPABASE CONNECTION
// =================================

window.SUPABASE_URL =
    "https://vorkbfjvfenqgmhcatyd.supabase.co";

window.SUPABASE_KEY =
    "sb_publishable_YMWNt8EIAXrK1lv6pQf4HA_LKhrB3Oz";


// =================================
// CRIAR CLIENTE SUPABASE
// =================================

if (!window.supabase) {

    console.error(
        "❌ Biblioteca Supabase não foi carregada."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            window.SUPABASE_URL,
            window.SUPABASE_KEY
        );

    console.log(
        "🚀 CloserAI conectado ao Supabase"
    );

}


// =================================
// OBTER EMPRESA
// =================================

async function obterEmpresaId() {

    let empresaId =
        localStorage.getItem("empresaId");


    if (empresaId) {

        console.log(
            "🟢 Empresa encontrada:",
            empresaId
        );

        return empresaId;

    }


    console.log(
        "⚠️ empresaId não encontrado."
    );


    if (!window.supabaseClient) {

        console.error(
            "❌ supabaseClient não existe."
        );

        return null;

    }


    const {
        data,
        error
    } = await window.supabaseClient
        .from("empresas")
        .select("id,nome_empresa")
        .limit(1);


    if (error) {

        console.error(
            "❌ Erro ao procurar empresa:",
            error
        );

        return null;

    }


    if (!data || data.length === 0) {

        console.error(
            "❌ Nenhuma empresa encontrada."
        );

        return null;

    }


    empresaId =
        data[0].id;


    localStorage.setItem(
        "empresaId",
        empresaId
    );


    localStorage.setItem(
        "empresaNome",
        data[0].nome_empresa || ""
    );


    console.log(
        "✅ Empresa recuperada:",
        empresaId
    );


    return empresaId;

}


// =================================
// TESTAR SUPABASE
// =================================

async function testarSupabase() {

    if (!window.supabaseClient) {

        console.error(
            "❌ supabaseClient não está disponível."
        );

        return false;

    }


    const {
        data,
        error
    } = await window.supabaseClient
        .from("empresas")
        .select("*")
        .limit(1);


    if (error) {

        console.error(
            "❌ Erro Supabase:",
            error
        );

        return false;

    }


    console.log(
        "✅ Supabase funcionando:",
        data
    );


    return true;

}