// =====================================
// CLOSERAI - CHAT DE TESTE + MEMÓRIA
// =====================================

// =====================================
// ELEMENTOS DA INTERFACE
// =====================================

const chat =
    document.getElementById("chat");

const mensagem =
    document.getElementById("mensagem");

const btnEnviar =
    document.getElementById("btnEnviar");

const btnLimpar =
    document.getElementById("btnLimpar");

const status =
    document.getElementById("status");


// =====================================
// MEMÓRIA DA IA
// =====================================

let conhecimento = null;


// =====================================
// EMPRESA
// =====================================

const empresaId =
    localStorage.getItem("empresaId");


// =====================================
// CLIENTE DE TESTE
// =====================================

let clienteTesteId =
    localStorage.getItem(
        "closerAI_clienteTeste_" + empresaId
    );


// =====================================
// VERIFICAR SUPABASE
// =====================================

function verificarSupabase() {

    if (!window.supabaseClient) {

        console.error(
            "❌ supabaseClient não está disponível."
        );

        if (status) {

            status.textContent =
                "🔴 Supabase não está conectado.";

        }

        return false;
    }

    return true;
}


// =====================================
// CARREGAR CONHECIMENTO DA IA
// =====================================

async function carregarIA() {

    if (!empresaId) {

        if (status) {

            status.textContent =
                "❌ Empresa não encontrada.";

        }

        return;
    }


    if (!verificarSupabase()) {

        return;

    }


    try {

        const {
            data,
            error
        } = await window.supabaseClient

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
                "❌ Erro ao carregar conhecimento:",
                error
            );

            if (status) {

                status.textContent =
                    "⚠️ IA sem conhecimento carregado.";

            }

            conhecimento = {};

            return;
        }


        if (
            data &&
            data.length > 0
        ) {

            conhecimento =
                data[0];


            console.log(
                "🧠 Conhecimento carregado:",
                conhecimento
            );


            if (status) {

                status.textContent =
                    "🟢 IA pronta para teste.";

            }

        } else {

            conhecimento = {};


            console.log(
                "⚠️ Nenhum conhecimento encontrado."
            );


            if (status) {

                status.textContent =
                    "🟡 IA pronta, mas sem conhecimento cadastrado.";

            }

        }

    } catch (error) {

        console.error(
            "❌ Erro inesperado ao carregar IA:",
            error
        );

        conhecimento = {};

    }

}


// =====================================
// CRIAR / RECUPERAR CLIENTE DE TESTE
// =====================================

async function obterClienteTeste() {

    if (!empresaId) {

        console.error(
            "❌ Empresa não encontrada."
        );

        return null;

    }


    if (!verificarSupabase()) {

        return null;

    }


    // =================================
    // RECUPERAR CLIENTE EXISTENTE
    // =================================

    if (clienteTesteId) {

        try {

            const {
                data: clienteExistente,
                error: erroCliente
            } = await window.supabaseClient

                .from("clientes")

                .select("*")

                .eq(
                    "id",
                    clienteTesteId
                )

                .eq(
                    "empresa_id",
                    empresaId
                )

                .maybeSingle();


            if (
                !erroCliente &&
                clienteExistente
            ) {

                console.log(
                    "👤 Cliente de teste recuperado:",
                    clienteExistente
                );

                return clienteExistente;

            }

        } catch (error) {

            console.error(
                "❌ Erro ao recuperar cliente:",
                error
            );

        }

    }


    // =================================
    // CRIAR NOVO CLIENTE
    // =================================

    console.log(
        "👤 Criando cliente de teste..."
    );


    const novoCliente = {

        empresa_id:
            empresaId,

        nome:
            "Cliente de Teste",

        email:
            "cliente.teste@closerai.local",

        telefone:
            "",

        canal:
            "Teste da IA",

        status:
            "Novo"

    };


    try {

        const {
            data,
            error
        } = await window.supabaseClient

            .from("clientes")

            .insert([
                novoCliente
            ])

            .select()

            .single();


        if (error) {

            console.error(
                "❌ Erro ao criar cliente:",
                error
            );

            return null;

        }


        clienteTesteId =
            data.id;


        localStorage.setItem(
            "closerAI_clienteTeste_" + empresaId,
            clienteTesteId
        );


        console.log(
            "✅ Cliente de teste criado:",
            data
        );


        return data;

    } catch (error) {

        console.error(
            "❌ Erro inesperado ao criar cliente:",
            error
        );

        return null;

    }

}


// =====================================
// CARREGAR HISTÓRICO
// =====================================

async function carregarHistorico() {

    if (!empresaId) {

        return;

    }


    if (!verificarSupabase()) {

        return;

    }


    try {

        const {
            data,
            error
        } = await window.supabaseClient

            .from("conversas")

            .select("*")

            .eq(
                "empresa_id",
                empresaId
            )

            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "❌ Erro ao carregar histórico:",
                error
            );

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            return;

        }


        data.forEach(
            function (conversa) {

                if (
                    conversa.mensagem_cliente
                ) {

                    adicionarMensagemUsuario(
                        conversa.mensagem_cliente
                    );

                }


                if (
                    conversa.resposta_ia
                ) {

                    adicionarMensagemIA(
                        conversa.resposta_ia
                    );

                }

            }
        );


        if (chat) {

            chat.scrollTop =
                chat.scrollHeight;

        }

    } catch (error) {

        console.error(
            "❌ Erro inesperado no histórico:",
            error
        );

    }

}


// =====================================
// MENSAGEM DO UTILIZADOR
// =====================================

function adicionarMensagemUsuario(
    texto
) {

    if (!chat) {

        return;

    }


    chat.innerHTML += `

        <div style="
            display:flex;
            justify-content:flex-end;
            margin:15px 0;
        ">

            <div class="card">

                👤 ${escaparHTML(texto)}

            </div>

        </div>

    `;

}


// =====================================
// MENSAGEM DA IA
// =====================================

function adicionarMensagemIA(
    texto
) {

    if (!chat) {

        return;

    }


    chat.innerHTML += `

        <div style="
            display:flex;
            justify-content:flex-start;
            margin:15px 0;
        ">

            <div class="card glow">

                🤖 ${escaparHTML(texto)}

            </div>

        </div>

    `;

}


// =====================================
// BOTÃO ENVIAR
// =====================================

if (btnEnviar) {

    btnEnviar.addEventListener(
        "click",
        enviarMensagem
    );

}


// =====================================
// ENTER PARA ENVIAR
// =====================================

if (mensagem) {

    mensagem.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                enviarMensagem();

            }

        }
    );

}


// =====================================
// ENVIAR MENSAGEM
// =====================================

async function enviarMensagem() {

    const texto =
        mensagem
            ? mensagem.value.trim()
            : "";


    if (!texto) {

        return;

    }


    if (!empresaId) {

        if (status) {

            status.textContent =
                "❌ Empresa não encontrada.";

        }

        return;

    }


    // =================================
    // VERIFICAR SUPABASE
    // =================================

    if (!verificarSupabase()) {

        return;

    }


    // =================================
    // MOSTRAR MENSAGEM
    // =================================

    adicionarMensagemUsuario(
        texto
    );


    if (mensagem) {

        mensagem.value = "";

    }


    if (status) {

        status.textContent =
            "🤖 A IA está a responder...";

    }


    // =================================
    // INDICADOR DE CARREGAMENTO
    // =================================

    const carregando =
        document.createElement(
            "div"
        );


    carregando.id =
        "carregando";


    carregando.innerHTML = `

        <div class="card glow">

            🤖 A pensar...

        </div>

    `;


    if (chat) {

        chat.appendChild(
            carregando
        );


        chat.scrollTop =
            chat.scrollHeight;

    }


    try {

        // =================================
        // CLIENTE DE TESTE
        // =================================

        const cliente =
            await obterClienteTeste();


        if (!cliente) {

            throw new Error(
                "Não foi possível criar o cliente de teste."
            );

        }


        console.log(
            "👤 Cliente associado:",
            cliente
        );


        // =================================
        // CHAMAR EDGE FUNCTION
        // =================================

        console.log(
            "📨 Enviando mensagem para closer-ai-test..."
        );


        const {
            data,
            error
        } = await window.supabaseClient.functions.invoke(

            "closer-ai-test",

            {

                body: {

                    mensagem:
                        texto,

                    conhecimento:
                        conhecimento || {},

                    empresa_id:
                        empresaId,

                    cliente_id:
                        cliente.id

                }

            }

        );


        console.log(
            "📥 Resposta da Edge Function:",
            data
        );


        if (error) {

            console.error(
                "❌ Erro da Edge Function:",
                error
            );

            throw error;

        }


        // =================================
        // REMOVER CARREGAMENTO
        // =================================

        if (carregando) {

            carregando.remove();

        }


        // =================================
        // OBTER RESPOSTA
        // =================================

        const resposta =
            data?.resposta ||
            data?.message ||
            data?.response ||
            "A IA não retornou uma resposta.";


        // =================================
        // MOSTRAR RESPOSTA
        // =================================

        adicionarMensagemIA(
            resposta
        );


        // =================================
        // GUARDAR CONVERSA
        // =================================

        const {
            error: salvarErro
        } = await window.supabaseClient

            .from("conversas")

            .insert({

                empresa_id:
                    empresaId,

                cliente_id:
                    cliente.id,

                mensagem_cliente:
                    texto,

                resposta_ia:
                    resposta,

                canal:
                    "Teste da IA"

            });


        if (salvarErro) {

            console.error(
                "❌ Erro ao guardar conversa:",
                salvarErro
            );


            if (status) {

                status.textContent =
                    "🟡 Resposta recebida, mas a conversa não foi guardada.";

            }

        } else {

            console.log(
                "💾 Conversa guardada."
            );


            if (status) {

                status.textContent =
                    "🟢 Resposta recebida e conversa guardada.";

            }

        }


        if (chat) {

            chat.scrollTop =
                chat.scrollHeight;

        }


    } catch (error) {

        console.error(
            "❌ Erro completo:",
            error
        );


        if (carregando) {

            carregando.remove();

        }


        if (chat) {

            chat.innerHTML += `

                <div style="
                    margin:15px 0;
                ">

                    <div class="card">

                        ❌ Erro ao contactar o servidor da IA.

                    </div>

                </div>

            `;

        }


        if (status) {

            status.textContent =
                "🔴 " + (
                    error?.message ||
                    "Erro ao contactar a IA."
                );

        }

    }

}


// =====================================
// LIMPAR CHAT
// =====================================

if (btnLimpar) {

    btnLimpar.addEventListener(
        "click",
        function() {

            if (chat) {

                chat.innerHTML = `

                    <div class="message ia">

                        🤖 Olá!

                        Sou o seu vendedor IA.

                        Como posso ajudar?

                    </div>

                `;

            }


            if (status) {

                status.textContent =
                    "🟢 IA pronta para responder.";

            }

        }
    );

}


// =====================================
// PROTEÇÃO HTML
// =====================================

function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(texto);


    return div.innerHTML;

}


// =====================================
// INICIAR CHAT
// =====================================

async function iniciarChat() {

    console.log(
        "🚀 Iniciando CloserAI..."
    );


    // Verificar se Supabase carregou

    if (!window.supabaseClient) {

        console.error(
            "❌ supabaseClient não encontrado."
        );


        if (status) {

            status.textContent =
                "🔴 Supabase não foi carregado. Verifique os scripts do HTML.";

        }

        return;

    }


    console.log(
        "✅ supabaseClient encontrado."
    );


    await carregarIA();

    await carregarHistorico();

}


iniciarChat();