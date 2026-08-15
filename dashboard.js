// =====================================
// CLOSERAI - DASHBOARD
// =====================================


document.addEventListener("DOMContentLoaded", async () => {


const empresaId = localStorage.getItem("empresaId");


if(!empresaId){

    console.log("Nenhuma empresa encontrada");

    return;

}



// ================================
// BUSCAR EMPRESA
// ================================


const { data: empresa, error: erroEmpresa } = await supabaseClient

.from("empresas")

.select("*")

.eq("id", empresaId)

.single();



if(empresa){


document.getElementById("nomeEmpresa").innerHTML =
empresa.nome_empresa || "Minha Empresa";


}





// ================================
// BUSCAR IA
// ================================


const { data: ia } = await supabaseClient

.from("conhecimento")

.select("*")

.eq("empresa_id", empresaId)

.order("created_at",{ascending:false})

.limit(1);



if(ia && ia.length > 0){


document.getElementById("nomeIA").innerHTML =

ia[0].nome_ia || "CloserAI";


}





// ================================
// CLIENTES
// ================================


const { count: clientes } = await supabaseClient

.from("clientes")

.select("*",{count:"exact",head:true})

.eq("empresa_id",empresaId);



document.getElementById("totalClientes").innerHTML =
clientes || 0;





// ================================
// CONVERSAS
// ================================


const { data: clientesEmpresa } = await supabaseClient

.from("clientes")

.select("id")

.eq("empresa_id",empresaId);



let totalConversas = 0;



if(clientesEmpresa){


for(let cliente of clientesEmpresa){


const { count } = await supabaseClient

.from("conversas")

.select("*",{count:"exact",head:true})

.eq("cliente_id",cliente.id);



totalConversas += count || 0;


}


}



document.getElementById("totalConversas").innerHTML =
totalConversas;






// ================================
// VENDAS
// ================================


const { data: vendas } = await supabaseClient

.from("vendas")

.select("valor")

.eq("empresa_id",empresaId);



let total = 0;



if(vendas){


vendas.forEach(venda=>{


total += Number(venda.valor) || 0;


});


}



document.getElementById("totalVendas").innerHTML =

"$" + total.toFixed(2);






// ================================
// AGENDA
// ================================


const { count: agenda } = await supabaseClient

.from("agenda")

.select("*",{count:"exact",head:true})

.eq("empresa_id",empresaId);



document.getElementById("totalAgenda").innerHTML =
agenda || 0;



console.log("✅ Dashboard carregado");


});