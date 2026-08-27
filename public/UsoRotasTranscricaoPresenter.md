# TranscricaoPresenter - Regras de Uso de APIs

Este documento detalha as regras de negócio e contextos de uso para cada endpoint consumido pelo `TranscricaoPresenter`.

---

## 1. Inicialização e Configuração

### 1.1. Obter Operador Logado
**Endpoint:** `GET /api/metadados/operador/ObterOperadorPeloLogin/?pNomLogin={login}&pTrazPerfilOperador=true`

**Quando usar:**
- Na inicialização da janela de transcrição
- Quando precisar validar permissões do usuário

**Regra:**
- Sempre passa `pTrazPerfilOperador=true` para carregar perfis e permissões
- O login vem de `Thread.CurrentPrincipal.Identity.Name` sem o prefixo `ECADBR\`

**Retorna:**
- Dados completos do operador (nome, id, perfis, permissões)

---

### 1.2. Carregar Layout de Tela do Usuário
**Endpoint:** `GET /api/av/tarefa/ListarLayoutTelaPorUsuario?pOperador={id}`

**Quando usar:**
- Ao abrir a janela de transcrição pela primeira vez
- Para restaurar a configuração personalizada do usuário (posição de docks, tamanhos)

**Regra:**
- Se retornar vazio ou falhar, usa layout padrão da aplicação
- Layout é salvo automaticamente ao fechar a janela

**Retorna:**
- `List<IConfiguracaoLayoutTela>` com posições e tamanhos de cada dock

---

### 1.3. Salvar Configuração de Layout
**Endpoint:** `POST /api/av/tarefa/SalvarConfiguracaoLayoutUsuario`

**Quando usar:**
- Ao fechar a janela de transcrição
- Quando o usuário redimensiona ou move docks

**Payload:**

```
{ "IdUsuario": 123, "ConfiguracoesDock": [ { "NomeDock": "ListaExecucao", "Width": 400, "Height": 600, "DockState": "Docked", "Position": "Left" } ] }
```

---

## 2. Carregamento de Combos/Dropdowns

### 2.1. Características (Modo Normal)
**Endpoint:** `GET /api/av/tarefa/listarCaracteristica`

**Quando usar:**
- Quando `Tarefa.Programa.lTipoAuditoria` **NÃO contém** `TipoAuditoriaEnum.ObraAudiovisual`
- Para tarefas de **Obra Musical pura**

**Regra:**
- Lista características genéricas (Trilha de Fundo, Tema de Abertura, etc.)
- Usado na Lista de Execução

**Retorna:**
- `List<ICaracteristica>` com características genéricas

---

### 2.2. Características (Teledramaturgia)
**Endpoint:** `POST /api/av/tarefa/ListarCaracteristicaMusicaAudio`

**Quando usar:**
- Quando `Tarefa.Programa.lTipoAuditoria` **CONTÉM** `TipoAuditoriaEnum.ObraAudiovisual`
- Para tarefas de **Teledramaturgia** (novelas, séries)

**Payload:**

```
{ "IdTipoAuditoria": 1  // TipoAuditoriaEnum.ObraAudiovisual }
```

**Regra:**
- Lista características específicas para audiovisual (Tema de Personagem, Trilha de Ação, etc.)
- Filtrado por tipo de auditoria

**Retorna:**
- `List<ICaracteristicaMusicaAudio>` específicas para obras audiovisuais

---

### 2.3. Canais
**Endpoint:** `GET /api/av/AvCaptado/ListarCanais`

**Quando usar:**
- Na tela de Pesquisa de Audiovisual Captado
- Para filtrar captações por canal de TV

**Regra:**
- Lista todos os canais cadastrados (Globo, Record, SBT, etc.)
- Não possui filtro

**Retorna:**
- `List<ICanalDTO>` com todos os canais

---

### 2.4. Captações
**Endpoint:** `GET /api/av/AvCaptado/ListarCaptacoes`

**Quando usar:**
- Na inicialização da janela de transcrição
- Para popular combo de captações

**Regra:**
- Lista todas as captações disponíveis
- Exibe: `{Canal} - {TipoCaptacao} ({DataInicio} a {DataFim})`

**Retorna:**
- `List<CaptacaoDTO>` ordenado por descrição

---

### 2.5. Tipos de Transmissão
**Endpoint:** `POST /api/av/AvCaptado/ListarTipoTransmissao`

**Payload:**

```
{ "Situacao": true  // Apenas ativos }
```

**Quando usar:**
- Na tela de Pesquisa de Audiovisual Captado
- Para filtrar por tipo de transmissão (Primeira Transmissão, Reprise, etc.)

**Regra:**
- Sempre filtra por `Situacao = true` (apenas ativos)

**Retorna:**
- `List<ITipoTransmissaoDTO>` apenas com registros ativos

---

### 2.6. Classificações Audiovisual/Musical
**Endpoint:** `POST /api/av/tarefa/listarTodasClassificacaoObraAudiovisualEMusical`

**Quando usar:**
- Na Lista de Execução ao adicionar/editar marcação
- Para classificar obras musicais (Nacional, Internacional, etc.)

**Regra:**
- Lista todas as classificações cadastradas
- Usado em conjunto com características

**Retorna:**
- `List<IClassificacaoObra>` com todas as classificações

---

## 3. Operações com Marcações (Lista de Execução)

### 3.1. Listar Marcações da Tarefa
**Endpoint:** `POST /api/av/tarefa/listarMarcacaoAV`

**Payload:**

```
{ "CodigoTarefa": 12345 }
```

**Quando usar:**
- Ao abrir uma tarefa específica
- Após salvar/atualizar marcações para recarregar a lista
- Para carregar marcações de **UMA tarefa específica**

**Regra:**
- Retorna apenas marcações da tarefa informada
- Inclui trechos, marcas e características
- **USO PRINCIPAL:** Carregar dados da tarefa atual na transcrição

**Retorna:**
- `List<IMarcacaoDTO>` da tarefa específica

---

### 3.2. Listar Todas as Marcações
**Endpoint:** `POST /api/av/tarefa/listarTodasMarcacoes`

**Payload:**

```
{ "FiltrosTarefaAV": { "CodigoPrograma": 789, "DataInicioPeriodo": "2024-01-01", "DataFimPeriodo": "2024-12-31" } }
```

**Quando usar:**
- Na funcionalidade de "Copiar Trecho" entre tarefas
- Para buscar marcações de **múltiplas tarefas** do mesmo programa
- Na tela de Visão Geral de tarefas

**Regra:**
- Retorna marcações de **TODAS as tarefas** que atendem ao filtro
- Usado para operações de cópia/mesclagem entre tarefas
- **USO PRINCIPAL:** Operações cross-tarefa (copiar, mesclar, comparar)

**Retorna:**
- `List<IMarcacaoDTO>` de múltiplas tarefas

**Diferença entre `listarMarcacaoAV` e `listarTodasMarcacoes`:**
| Aspecto | listarMarcacaoAV | listarTodasMarcacoes |
|---------|------------------|----------------------|
| **Escopo** | Uma tarefa específica | Múltiplas tarefas |
| **Filtro** | CodigoTarefa | FiltrosTarefaAV (programa, período, etc.) |
| **Uso** | Carregar tarefa para transcrição | Copiar/mesclar entre tarefas |
| **Performance** | Rápido (uma tarefa) | Mais lento (várias tarefas) |

---

### 3.3. Salvar Nova Marcação
**Endpoint:** `POST /api/av/tarefa/salvarMarcacao`

**Payload:**

```
{ "Marcacao": { "CodigoTarefa": 12345, "Inicio": "00:05:30.123", "Fim": "00:08:45.456", "TipoMarcacao": 1,  // 1=Trecho, 2=Marca "CodigoCaracteristica": 3, "CodigoClassificacao": 2 }, "Logs": [ { "CodigoMarcacao": 0, "TipoOperacao": 1,  // 1=Inserção "NomeColuna": "COD_MARCACAO", "ValorNovo": null, "ValorVelho": null, "OrigemInteracao": 1,  // 1=ListaExecucao "CodigoTarefa": 12345 } ] }
```

**Quando usar:**
- Ao criar um novo trecho na Lista de Execução
- Ao inserir uma nova marca na Janela de Exibição (waveform)
- Após definir um trecho com Ctrl+R

**Regra:**
- **Sempre** inclui log de produtividade (`Logs`)
- `CodigoMarcacao = 0` para nova marcação
- Valida sobreposição de trechos antes de salvar
- Verifica se tarefa está em modo de edição (não concluída)

**Retorna:**
- `int`: Código da marcação criada

---

### 3.4. Atualizar Marcação Existente
**Endpoint:** `POST /api/av/tarefa/AtualizaMarcacao`

**Payload:**

```
{ "Marcacao": { "Codigo": 6789, "CodigoTarefa": 12345, "Inicio": "00:05:35.000",  // Alterado "Fim": "00:08:45.456", "TipoMarcacao": 1, "CodigoCaracteristica": 5,  // Alterado "CodigoClassificacao": 2 }, "Logs": [ { "CodigoMarcacao": 6789, "TipoOperacao": 2,  // 2=Alteração "NomeColuna": "INICIO", "ValorNovo": "00:05:35.000", "ValorVelho": "00:05:30.123", "OrigemInteracao": 1, "CodigoTarefa": 12345 }, { "CodigoMarcacao": 6789, "TipoOperacao": 2, "NomeColuna": "COD_CARACTERISTICA", "ValorNovo": "5", "ValorVelho": "3", "OrigemInteracao": 1, "CodigoTarefa": 12345 } ] }
```


**Quando usar:**
- Ao editar características, classificação ou tempos de um trecho
- Ao arrastar bordas de trechos na Visão Geral
- Ao redimensionar marcação na Janela de Exibição
- Ao colar dados copiados em um trecho

**Regra:**
- `Marcacao.Codigo` **DEVE existir** (> 0)
- **Um log para cada campo alterado**
- Valida conflitos com outros trechos após alteração

**Retorna:**
- `void` (sem retorno, lança exceção se falhar)

---

### 3.5. Remover Marcação
**Endpoint:** `POST /api/av/tarefa/RemoveMarcacao`

**Payload:**

```
{ "Marcacao": { "Codigo": 6789, "CodigoTarefa": 12345 }, "Logs": [ { "CodigoMarcacao": 6789, "TipoOperacao": 3,  // 3=Exclusão "NomeColuna": "COD_MARCACAO", "ValorNovo": null, "ValorVelho": null, "OrigemInteracao": 1, "CodigoTarefa": 12345 } ] }
```

**Quando usar:**
- Ao pressionar F4 em um trecho selecionado
- Ao excluir marca na Janela de Exibição (Alt+D ou Alt+E)
- Ao desfazer trecho (Ctrl+D)

**Regra:**
- Valida se marcação pertence à tarefa
- Não permite excluir se houver dependências (obras associadas)
- Remove do banco e da lista em memória

**Retorna:**
- `void`

---

### 3.6. Salvar Alterações em Lote
**Endpoint:** `POST /api/av/tarefa/SalvarAlteracoesMarcacoes`

**Payload:**

```
{ "Marcacoes": [ { "Codigo": 6789, "CodigoTarefa": 12345, "Inicio": "00:05:35.000", "Fim": "00:08:50.000" }, { "Codigo": 6790, "CodigoTarefa": 12345, "Inicio": "00:09:00.000", "Fim": "00:11:30.000" } ], "Logs": [ { /* Log da marcação 6789 / }, { / Log da marcação 6790 */ } ] }
```

**Quando usar:**
- Ao salvar a tarefa inteira (Ctrl+S)
- Ao concluir tarefa
- Quando múltiplas marcações foram alteradas

**Regra:**
- **Transação única:** Se uma falhar, todas falham (rollback)
- Mais eficiente que salvar individualmente
- Usado no salvamento geral da tarefa

**Retorna:**
- `bool`: true se todas salvaram com sucesso

---

## 4. Operações com Marcações Audiovisual (CueSheet/Capítulos)

### 4.1. Listar Marcações Audiovisual
**Endpoint:** `POST /api/av/tarefa/ListarModelMarcacaoAudiovisual?pCodTarefa={id}`

**Quando usar:**
- Ao abrir tarefa de **Teledramaturgia**
- Para carregar capítulos/episódios e obras audiovisuais vinculadas

**Regra:**
- Apenas para tarefas com `TipoAuditoriaEnum.ObraAudiovisual`
- Retorna hierarquia: Obra AV → Capítulos → Episódios

**Retorna:**
- `IModelMarcacaoAudiovisual` com hierarquia completa

---

### 4.2. Salvar Marcação CueSheet
**Endpoint:** `POST /api/av/tarefa/SalvarMarcacaoTranscricaoCueSheet`

**Payload:**

```
{ "CodigoTarefa": 12345, "Inicio": "00:00:00.000", "Fim": "00:45:00.000", "CodigoObraAudiovisual": 999, "CodigoCapituloEpisodio": null, "TituloCapitulo": "Episódio 1", "NumeroCapitulo": 1 }
```

**Quando usar:**
- Ao criar um novo capítulo/episódio em tarefa de Teledramaturgia
- Na tela de Cabecalho Audiovisual Capítulo

**Regra:**
- Usado apenas em tarefas de Teledramaturgia
- Cria vínculo entre tarefa e obra audiovisual
- Valida período do capítulo dentro da tarefa

**Retorna:**
- `int`: Código da marcação audiovisual criada

---

### 4.3. Atualizar Marcação CueSheet
**Endpoint:** `POST /api/av/tarefa/AtualizaMarcacaoTranscricaoCueSheet`

**Quando usar:**
- Ao editar dados de um capítulo existente
- Ao alterar obra audiovisual vinculada

**Regra:**
- Apenas capítulos da tarefa atual
- Não permite alterar se tarefa estiver concluída

---

### 4.4. Remover Marcação CueSheet
**Endpoint:** `POST /api/av/tarefa/RemoveMarcacaoTranscricaoCueSheet`

**Quando usar:**
- Ao excluir um capítulo da tarefa de Teledramaturgia

**Regra:**
- Valida se há trechos associados ao capítulo
- Remove cascata (capítulo + episódios + trechos)

---

### 4.5-4.8. Operações com Marcação Audiovisual (Sem CueSheet)
**Endpoints:**
- `POST /api/av/tarefa/SalvarMarcacaoTranscricaoAudiovisual`
- `POST /api/av/tarefa/AtualizaMarcacaoTranscricaoAudiovisual`
- `POST /api/av/tarefa/RemoveMarcacaoTranscricaoAudiovisual`
- `POST /api/av/tarefa/AtualizaMarcacoesTranscricaoAudiovisual`

**Diferença do CueSheet:**
- **CueSheet:** Trabalha com modelo de capítulos/episódios estruturados
- **Audiovisual:** Trabalha com obras audiovisuais diretas (filmes, documentários)

**Quando usar:**
- CueSheet: Novelas, séries com episódios
- Audiovisual: Filmes, documentários, programas avulsos

---

## 5. Operações com Execução/Planilha

### 5.1. Listar Execuções Planilha
**Endpoint:** `POST /api/av/tarefa/listarExecucaoPlanilha`

**Payload:**

```
{ "CodigoTarefa": 12345 }
```

**Quando usar:**
- Ao abrir a aba "Lista Planilha"
- Para carregar marcações de obras musicais já identificadas

**Regra:**
- Diferença entre **Lista de Execução** e **Lista Planilha:**
  - **Lista de Execução:** Trechos brutos (ainda não identificados)
  - **Lista Planilha:** Trechos com obras musicais identificadas
- Na Lista Planilha é onde se vincula fonogramas, obras musicais, pot-pourri

**Retorna:**
- `List<IExecucaoPlanilhaDTO>` com obras identificadas

---

### 5.2. Salvar Marcação Execução Planilha
**Endpoint:** `POST /api/av/tarefa/salvarMarcacaoExecucaoPlanilha`

**Quando usar:**
- Ao associar uma obra musical a um trecho da Lista de Execução
- Ao criar um novo registro na Lista Planilha

**Regra:**
- Move trecho de "Lista de Execução" para "Lista Planilha"
- Vincula obra musical identificada

---

### 5.3. Atualizar Marcação Execução Planilha
**Endpoint:** `POST /api/av/tarefa/atualizaMarcacaoExecucaoPlanilha`

**Quando usar:**
- Ao alterar obra musical vinculada
- Ao corrigir dados de execução na planilha

---

### 5.4. Remover Marcação Execução Planilha
**Endpoint:** `POST /api/av/tarefa/removeMarcacaoExecucaoPlanilha`

**Quando usar:**
- Ao desassociar obra musical de um trecho
- Move trecho de volta para "Lista de Execução"

---

## 6. Operações com Tarefa

### 6.1. Salvar Tarefa AV
**Endpoint:** `POST /api/av/tarefa/salvarTarefaAV`

**Payload:**

```
{ "CodigoTarefa": 12345, "Observacao": "Tarefa revisada", "DataInicial": "2024-07-15 20:00:00", "DataFinal": "2024-07-15 21:30:00", "ListaMarcacoes": [ /* todas as marcações / ], "ListaExecucaoPlanilha": [ / obras identificadas */ ] }
```

**Quando usar:**
- Ao pressionar Ctrl+S (Salvar)
- Periodicamente durante a transcrição (auto-save se configurado)
- Antes de fechar a janela

**Regra:**
- Salva TODOS os dados da tarefa (marcações + planilha + observações)
- Valida integridade antes de salvar
- Registra log de produtividade

**Retorna:**
- `bool`: true se salvou com sucesso

---

### 6.2. Alterar Estado da Tarefa
**Endpoint:** `POST /api/av/tarefa/alterarEstadoTarefa?pCodTarefa={id}&pDscLogin={login}&pDscObservacao={obs}`

**Quando usar:**
- Ao **Me Associar** a uma tarefa
- Ao **Desassociar** de uma tarefa
- Ao mudar status (Em Andamento → Pausada)

**Parâmetros:**
- `pCodTarefa`: Código da tarefa
- `pDscLogin`: Login do operador
- `pDscObservacao`: Motivo da alteração (opcional)

**Regra:**
- Valida se operador tem permissão
- Impede alteração se tarefa concluída
- Registra histórico de mudança de estado

**Estados possíveis:**
- `Nova` → `EmAndamento` (Me Associar)
- `EmAndamento` → `Pausada` (Pausar)
- `Pausada` → `EmAndamento` (Retomar)

---

### 6.3. Concluir Tarefa Obra Audiovisual
**Endpoint:** `POST /api/av/tarefa/ConcluirTarefaObraAudiovisual`

**Payload:**

```
{ "CodigoTarefa": 12345, "DscLoginOperador": "JOAO.SILVA" }
```

**Quando usar:**
- Ao clicar em "Concluir Tarefa" no menu
- Após validação de que todos os trechos foram identificados

**Regra:**
- **Validações antes de concluir:**
  1. Todos os trechos devem ter características
  2. Trechos musicais devem estar na Lista Planilha
  3. Tarefa deve estar associada ao operador
  4. Capítulos (se Teledramaturgia) devem estar completos
- Muda status para `Concluida`
- Libera tarefa para auditoria/aprovação

**Retorna:**
- `bool`: true se concluiu, lança exceção com validações se falhar

---

### 6.4. Listar Tipos de Auditoria
**Endpoint:** `GET /api/av/tarefa/ListarTipoAuditoriaTarefa?pCodTarefa={id}`

**Quando usar:**
- Ao carregar tarefa para saber quais abas exibir
- Para determinar se é Teledramaturgia ou não

**Regra:**
- Define comportamento da interface:
  - Se tem `ObraAudiovisual` → Exibe aba Cabecalho AV Capítulo
  - Se tem `ObraMusical` → Exibe Lista Planilha
  - Se tem `ObraAudiovisualMusical` → Exibe ambas

**Retorna:**
- `List<TipoAuditoriaEnum>` da tarefa

---

### 6.5. Obter Status de Expurgo
**Endpoint:** `POST /api/av/tarefa/ObterStatusExpurgo`

**Payload:**

```
{ "CodigoTarefa": 12345, "CodigoCaptacao": 5, "DataInicial": "2024-07-15 20:00:00", "DataFinal": "2024-07-15 21:30:00" }
```

**Quando usar:**
- Ao abrir tarefa para verificar se arquivos estão disponíveis
- Antes de carregar o player

**Regra:**
- Verifica se arquivos de vídeo foram expurgados (deletados por política de retenção)
- Se expurgado, exibe opção de solicitar recuperação

**Retorna:**

```
{ "Situacao": 1,  // 0=Disponível, 1=Expurgado, 2=EmRecuperacao "MensagemStatus": "Arquivos expurgados. Solicitar recuperação?" }
```

---

## 7. Operações de Ajuste de Borda

### 7.1. Ajustar Duração da Tarefa
**Endpoint:** `POST /api/av/tarefa/AjustarDuracaoTarefa`

**Payload:**

```
{ "CodigoTarefa": 12345, "NovaDataInicial": "2024-07-15 20:02:00",  // +2 minutos "NovaDataFinal": "2024-07-15 21:28:00",    // -2 minutos "MotivoAjuste": "Comerciais no início e fim" }
```


**Quando usar:**
- Ao pressionar Ctrl+F5 (Ajustar Bordas)
- Quando início/fim da tarefa contém comerciais ou conteúdo irrelevante

**Regra:**
- **Validação:** Nova duração >= 5 minutos
- **Validação:** Não pode cortar trechos já marcados
- Ajusta `DataInicial` e `DataFinal` da tarefa
- Registra log de auditoria

**Retorna:**
- `bool`: true se ajustou com sucesso

---

### 7.2. Obter Marca Início/Fim Original
**Endpoint:** `GET /api/av/tarefa/ObterMarcaInicioOuFimOriginal?CodTarefa={id}&Operacao={op}`

**Parâmetros:**
- `CodTarefa`: Código da tarefa
- `Operacao`: `"Inicio"` ou `"Fim"`

**Quando usar:**
- Na tela de Ajuste de Bordas para mostrar valor original
- Para comparar com valor atual

**Regra:**
- Retorna data/hora original da criação da tarefa
- Usado para validação e auditoria

**Retorna:**
- `DateTime`: Data/hora original

---

### 7.3. Incluir Log de Ajuste
**Endpoint:** `POST /api/av/tarefa/IncluirLogAjuste`

**Payload:**

```
{ "CodigoTarefa": 12345, "LoginOperador": "JOAO.SILVA", "DataOriginalInicio": "2024-07-15 20:00:00", "DataNovaInicio": "2024-07-15 20:02:00", "DataOriginalFim": "2024-07-15 21:30:00", "DataNovaFim": "2024-07-15 21:28:00", "Motivo": "Comerciais no início e fim", "DataHoraAjuste": "2024-07-16 10:30:00" }
```

**Quando usar:**
- Automaticamente após `AjustarDuracaoTarefa`
- Para auditoria e rastreabilidade

**Regra:**
- Log obrigatório para qualquer ajuste de borda
- Usado em relatórios de auditoria

---

## 8. Operações com Audiovisual Captado

### 8.1. Listar AV Captado Completo
**Endpoint:** `POST /api/av/AvCaptado/ListarAudioVisualCaptadoComFalhas`

**Payload:**

```
{ "CodigoCaptacao": 5, "DataInicial": "2024-07-15 00:00:00", "DataFinal": "2024-07-15 23:59:59", "CodigoCanal": 3 }
```


**Quando usar:**
- Na tela de Pesquisa de Audiovisual Captado
- Para buscar arquivos disponíveis para criar nova tarefa

**Regra:**
- Retorna arquivos mesmo com falhas de captação
- Inclui status de cada arquivo (OK, Falha, Indisponível)

**Retorna:**
- `List<AudiovisualCaptadoDTO>` com status detalhado

---

### 8.2. Listar AV Captado com Links
**Endpoint:** `POST /api/av/AvCaptado/ListarAVCaptadoLink?ListarLinks={bool}`

**Payload:**

```
{ "CodigoTarefa": 12345, "ListarLinks": true }
```

**Parâmetro:**
- `ListarLinks = true`: Retorna também URLs de download
- `ListarLinks = false`: Retorna apenas metadados

**Quando usar:**
- Ao carregar tarefa para download de arquivos de vídeo
- `ListarLinks=true` quando vai baixar arquivos
- `ListarLinks=false` quando só precisa verificar disponibilidade

**Regra:**
- URLs têm validade temporária (geralmente 2 horas)
- Após expiração, chamar novamente com `ListarLinks=true`

**Retorna:**

```
[ { "CodigoAVCaptado": 789, "NomeArquivo": "GLO_20240715_200000.avi", "UrlDownload": "http://storage.ecad.br/videos/abc123...", "DataExpiracao": "2024-07-16T12:30:00" } ]
```

---

### 8.3. Listar Links AV
**Endpoint:** `POST /api/av/AvCaptado/ListarLinkAV`

**Payload:**

```
{ "ListaCodigosAV": [789, 790, 791] }
```


**Quando usar:**
- Para renovar links expirados
- Quando lista de arquivos já é conhecida

**Diferença de `ListarAVCaptadoLink`:**
- `ListarAVCaptadoLink`: Busca por tarefa (CodigoTarefa)
- `ListarLinkAV`: Busca por lista de códigos de AV

**Regra:**
- Mais eficiente quando já sabe os códigos de AV necessários

---

### 8.4. Incluir Solicitação de Recuperação
**Endpoint:** `POST /api/av/AvCaptado/IncluirSolicitacaoRecuperacaoTarefa`

**Payload:**

```
{ "CodTarefa": 12345, "CodCaptacao": 5, "DataInicioPeriodo": "2024-07-15 20:00:00", "DataFimPeriodo": "2024-07-15 21:30:00", "IdNumberOperador": 123, "Situacao": 1,  // Nova "DataSolicitacao": "2024-07-16 10:00:00", "CodTipoSolicitacao": 1  // EnvioTradicional }
```


**Quando usar:**
- Quando arquivos foram expurgados (`ObterStatusExpurgo` retorna `Expurgado`)
- Usuário clica em "Solicitar Recuperação"

**Regra:**
- Cria solicitação para equipe de infraestrutura
- Processo assíncrono (pode levar horas ou dias)
- Usuário é notificado quando arquivos estiverem disponíveis

**Estado da solicitação:**
- `1 - Nova`: Aguardando processamento
- `2 - EmRecuperacao`: Em andamento
- `3 - Concluida`: Arquivos restaurados
- `4 - FalhaNaRecuperacao`: Erro na recuperação

---

## Resumo de Diferenças Principais

### Marcações: Tarefa Única vs Múltiplas Tarefas
| Operação | Endpoint | Escopo | Uso |
|----------|----------|--------|-----|
| Listar da tarefa | `listarMarcacaoAV` | Uma tarefa | Transcrição normal |
| Listar todas | `listarTodasMarcacoes` | Múltiplas tarefas | Copiar entre tarefas |

### Características: Normal vs Teledramaturgia
| Operação | Endpoint | Quando Usar |
|----------|----------|-------------|
| Características genéricas | `listarCaracteristica` | Obra Musical pura |
| Características específicas | `ListarCaracteristicaMusicaAudio` | Obra Audiovisual (Teledramaturgia) |

### CueSheet vs Audiovisual
| Aspecto | CueSheet | Audiovisual |
|---------|----------|-------------|
| **Tipo de Obra** | Episódica (novelas, séries) | Avulsa (filmes, documentários) |
| **Estrutura** | Obra → Capítulos → Episódios | Obra → Marcações diretas |
| **Endpoints** | `*CueSheet` | `*Audiovisual` |

### Lista de Execução vs Lista Planilha
| Aspecto | Lista de Execução | Lista Planilha |
|---------|-------------------|----------------|
| **Conteúdo** | Trechos brutos | Trechos identificados |
| **Endpoint Listar** | `listarMarcacaoAV` | `listarExecucaoPlanilha` |
| **Vinculação** | Características genéricas | Obras musicais específicas |
| **Fluxo** | Criado primeiro | Move de Execução após identificar obra |

### Links AV: Com Tarefa vs Lista de Códigos
| Operação | Endpoint | Entrada | Uso |
|----------|----------|---------|-----|
| Por tarefa | `ListarAVCaptadoLink` | CodigoTarefa | Carregar tarefa completa |
| Por lista de AVs | `ListarLinkAV` | Lista de Códigos AV | Renovar links específicos |

---

## Ordem Típica de Chamadas ao Abrir Tarefa

1. **Carregar Operador:** `ObterOperadorPeloLogin`
2. **Carregar Layout:** `ListarLayoutTelaPorUsuario`
3. **Verificar Expurgo:** `ObterStatusExpurgo`
4. **Listar Links:** `ListarAVCaptadoLink` (ListarLinks=true)
5. **Baixar Vídeos:** (Download via URLs retornadas)
6. **Listar Marcações:** `listarMarcacaoAV`
7. **Listar Planilha:** `listarExecucaoPlanilha`
8. **Listar Tipos Auditoria:** `ListarTipoAuditoriaTarefa`
9. **Se Teledramaturgia:**
   - `ListarModelMarcacaoAudiovisual`
   - `ListarCaracteristicaMusicaAudio`
10. **Se Obra Musical:**
    - `listarCaracteristica`
    - `listarTodasClassificacaoObraAudiovisualEMusical`

---

## Ordem Típica ao Salvar Tarefa

1. **Validar Alterações:** (Cliente valida antes de enviar)
2. **Salvar Marcações em Lote:** `SalvarAlteracoesMarcacoes`
3. **Salvar Planilha:** `salvarMarcacaoExecucaoPlanilha` (se houver alterações)
4. **Salvar Tarefa:** `salvarTarefaAV`
5. **Se Concluindo:**
   - `ConcluirTarefaObraAudiovisual`
   - `alterarEstadoTarefa` (para status Concluida)

---

**Observação:** Este documento reflete as regras identificadas no código do `TranscricaoPresenter`. Para detalhes de implementação do backend, a API deve ser consultada.