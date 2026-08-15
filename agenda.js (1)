// =====================================
// CLOSERAI - AGENDA
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    carregarAgenda
);


// =====================================
// CARREGAR AGENDA
// =====================================

async function carregarAgenda() {

    const lista =
        document.getElementById("agendaLista");

    const mensagem =
        document.getElementById("agendaMensagem");


    console.log(
        "📅 Carregando agenda..."
    );


    if (mensagem) {

        mensagem.textContent =
            "🔎 A procurar empresa...";

    }


    // Obter empresa

    const empresaId =
        await obterEmpresaId();


    console.log(
        "🏢 Empresa:",
        empresaId
    );


    if (!empresaId) {

        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:#ef4444;
                        ">

                        ❌ Nenhuma empresa encontrada.

                    </td>

                </tr>

            `;

        }


        if (mensagem) {

            mensagem.textContent =
                "Não foi possível identificar a empresa.";

        }


        return;

    }


    if (mensagem) {

        mensagem.textContent =
            "📡 A carregar eventos...";

    }


    // Buscar eventos

    const { data, error } =
        await supabaseClient
            .from("agenda")
            .select("*")
            .eq("empresa_id", empresaId)
            .order(
                "data_evento",
                {
                    ascending: true
                }
            );


    console.log(
        "📦 Resultado da agenda:",
        data,
        error
    );


    if (error) {

        console.error(
            "❌ Erro da agenda:",
            error
        );


        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td colspan="4"
                        style="
                        padding:30px;
                        text-align:center;
                        color:#ef4444;
                        ">

                        ❌ ${escaparHTML(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }


        if (mensagem) {

            mensagem.textContent =
                "Erro ao carregar agenda.";

        }


        return;

    }


    mostrarEventos(
        data || []
    );


    atualizarEstatisticas(
        data || []
    );


    if (mensagem) {

        mensagem.textContent =
            "🟢 Agenda carregada com sucesso.";

    }

}


// =====================================
// MOSTRAR EVENTOS
// =====================================

function mostrarEventos(eventos) {

    const lista =
        document.getElementById(
            "agendaLista"
        );


    if (!lista) {

        console.error(
            "❌ agendaLista não encontrado."
        );

        return;

    }


    lista.innerHTML = "";


    if (eventos.length === 0) {

        lista.innerHTML = `

            <tr>

                <td colspan="4"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#94a3b8;
                    ">

                    📅 Nenhum evento agendado.

                </td>

            </tr>

        `;

        return;

    }


    eventos.forEach(
        evento => {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td style="padding:15px 8px;">

                    ${formatarData(
                        evento.data_evento
                    )}

                </td>


                <td style="padding:15px 8px;">

                    ${escaparHTML(
                        evento.titulo ||
                        evento.evento ||
                        "Sem título"
                    )}

                </td>


                <td style="padding:15px 8px;">

                    ${escaparHTML(
                        evento.cliente ||
                        evento.cliente_nome ||
                        "Sem cliente"
                    )}

                </td>


                <td style="padding:15px 8px;">

                    ${escaparHTML(
                        evento.status ||
                        "Agendado"
                    )}

                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );

}


// =====================================
// ESTATÍSTICAS
// =====================================

function atualizarEstatisticas(
    eventos
) {

    const reunioesHoje =
        document.getElementById(
            "reunioesHoje"
        );

    const lembretes =
        document.getElementById(
            "lembretes"
        );

    const followup =
        document.getElementById(
            "followup"
        );

    const tarefas =
        document.getElementById(
            "tarefas"
        );


    if (reunioesHoje) {

        const hoje =
            new Date();


        const total =
            eventos.filter(
                evento => {

                    if (!evento.data_evento) {
                        return false;
                    }


                    const data =
                        new Date(
                            evento.data_evento
                        );


                    return (
                        data.getDate() ===
                        hoje.getDate() &&

                        data.getMonth() ===
                        hoje.getMonth() &&

                        data.getFullYear() ===
                        hoje.getFullYear()
                    );

                }
            ).length;


        reunioesHoje.textContent =
            total;

    }


    if (lembretes) {

        lembretes.textContent =
            eventos.filter(
                evento =>
                    String(
                        evento.status || ""
                    ).toLowerCase()
                    .includes("pendente")
            ).length;

    }


    if (followup) {

        followup.textContent =
            eventos.filter(
                evento =>
                    String(
                        evento.status || ""
                    ).toLowerCase()
                    .includes("follow")
            ).length;

    }


    if (tarefas) {

        tarefas.textContent =
            eventos.filter(
                evento =>
                    String(
                        evento.status || ""
                    ).toLowerCase()
                    .includes("tarefa")
            ).length;

    }

}


// =====================================
// FORMATAR DATA
// =====================================

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const dataObj =
        new Date(data);


    if (
        isNaN(
            dataObj.getTime()
        )
    ) {

        return String(data);

    }


    return dataObj.toLocaleString(
        "pt-PT",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================
// PROTEÇÃO HTML
// =====================================

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(texto ?? "");


    return div.innerHTML;

}