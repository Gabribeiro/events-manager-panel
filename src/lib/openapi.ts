const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Events Manager API',
    version: '1.0.0',
    description:
      'API local (json-server) utilizada pelo painel de gestão de eventos. Fornece dados de eventos, participantes e histórico de check-ins.',
    contact: { name: 'Gabriel Ribeiro' },
  },
  servers: [{ url: 'http://localhost:3001', description: 'json-server local' }],
  tags: [
    { name: 'Eventos', description: 'Listagem e detalhes dos eventos' },
    { name: 'Participantes', description: 'Participantes inscritos por evento' },
    { name: 'Check-ins', description: 'Registro e histórico de check-ins' },
  ],
  paths: {
    '/events': {
      get: {
        tags: ['Eventos'],
        summary: 'Listar todos os eventos',
        description: 'Retorna a lista completa de eventos com métricas agregadas.',
        responses: {
          200: {
            description: 'Lista de eventos',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } },
                example: [
                  {
                    id: 'EVT-001',
                    name: 'Tech Summit 2025',
                    date: '2025-05-15T09:00:00-03:00',
                    location: 'Centro de Convenções, São Paulo – SP',
                    status: 'active',
                    description: 'O maior evento de tecnologia do Brasil.',
                    expected_count: 12,
                    checkin_count: 11,
                    error_count: 1,
                    entry_rate: 0.92,
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/events/{id}': {
      get: {
        tags: ['Eventos'],
        summary: 'Buscar evento por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'EVT-001' },
          },
        ],
        responses: {
          200: {
            description: 'Dados do evento',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' },
              },
            },
          },
          404: { description: 'Evento não encontrado' },
        },
      },
      patch: {
        tags: ['Eventos'],
        summary: 'Atualizar métricas do evento',
        description:
          'Atualiza `checkin_count`, `error_count` e `entry_rate` após um check-in.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'EVT-001' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventPatch' },
              example: { checkin_count: 12, error_count: 1, entry_rate: 0.92 },
            },
          },
        },
        responses: {
          200: {
            description: 'Evento atualizado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Event' } },
            },
          },
        },
      },
    },
    '/participants': {
      get: {
        tags: ['Participantes'],
        summary: 'Listar participantes de um evento',
        description: 'Filtra participantes pelo `event_id` via query string.',
        parameters: [
          {
            name: 'event_id',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'EVT-001' },
            description: 'ID do evento para filtrar participantes',
          },
        ],
        responses: {
          200: {
            description: 'Lista de participantes do evento',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Participant' } },
                example: [
                  {
                    id: 'EVT-001-P001',
                    event_id: 'EVT-001',
                    name: 'Ana Pereira',
                    type: 'vip',
                    status: 'outside',
                    checkin_count: 4,
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/participants/{id}': {
      patch: {
        tags: ['Participantes'],
        summary: 'Atualizar status do participante',
        description:
          'Atualiza `status` (inside/outside) e `checkin_count` após um check-in bem-sucedido.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'EVT-001-P001' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ParticipantPatch' },
              example: { status: 'inside', checkin_count: 5 },
            },
          },
        },
        responses: {
          200: {
            description: 'Participante atualizado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Participant' } },
            },
          },
        },
      },
    },
    '/checkins': {
      get: {
        tags: ['Check-ins'],
        summary: 'Listar check-ins de um evento',
        parameters: [
          {
            name: 'event_id',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'EVT-001' },
          },
        ],
        responses: {
          200: {
            description: 'Histórico de check-ins',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Checkin' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Check-ins'],
        summary: 'Registrar check-in',
        description: `Registra uma tentativa de check-in. Pode ser sucesso ou erro conforme as regras de negócio:
- **VIP**: pode entrar e sair múltiplas vezes
- **Normal**: apenas 1 entrada permitida; nova tentativa gera \`error_reason: "already_checked_in"\`
- **Evento encerrado**: retorna \`error_reason: "event_closed"\``,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckinPayload' },
              examples: {
                entrada_vip: {
                  summary: 'Entrada de participante VIP',
                  value: {
                    event_id: 'EVT-001',
                    participant_id: 'EVT-001-P001',
                    timestamp: '2025-05-15T09:15:00.000Z',
                    success: true,
                    action: 'entry',
                    error_reason: null,
                  },
                },
                erro_normal: {
                  summary: 'Tentativa duplicada de participante normal',
                  value: {
                    event_id: 'EVT-001',
                    participant_id: 'EVT-001-P004',
                    timestamp: '2025-05-15T10:30:00.000Z',
                    success: false,
                    action: 'entry',
                    error_reason: 'already_checked_in',
                  },
                },
                evento_encerrado: {
                  summary: 'Check-in bloqueado — evento encerrado',
                  value: {
                    event_id: 'EVT-002',
                    participant_id: 'EVT-002-P001',
                    timestamp: '2025-05-15T11:00:00.000Z',
                    success: false,
                    action: 'entry',
                    error_reason: 'event_closed',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Check-in registrado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Checkin' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Event: {
        type: 'object',
        required: [
          'id', 'name', 'date', 'location', 'status', 'description',
          'expected_count', 'checkin_count', 'error_count', 'entry_rate',
        ],
        properties: {
          id: { type: 'string', example: 'EVT-001' },
          name: { type: 'string', example: 'Tech Summit 2025' },
          date: { type: 'string', format: 'date-time', example: '2025-05-15T09:00:00-03:00' },
          location: { type: 'string', example: 'Centro de Convenções, São Paulo – SP' },
          status: {
            type: 'string',
            enum: ['active', 'closed', 'cancelled'],
            description: 'active = aceita check-ins | closed = encerrado | cancelled = cancelado',
          },
          description: { type: 'string' },
          expected_count: { type: 'integer', example: 12 },
          checkin_count: { type: 'integer', example: 11 },
          error_count: { type: 'integer', example: 1 },
          entry_rate: { type: 'number', format: 'float', minimum: 0, maximum: 1, example: 0.92 },
        },
      },
      EventPatch: {
        type: 'object',
        properties: {
          checkin_count: { type: 'integer' },
          error_count: { type: 'integer' },
          entry_rate: { type: 'number', format: 'float' },
        },
      },
      Participant: {
        type: 'object',
        required: ['id', 'event_id', 'name', 'type', 'status', 'checkin_count'],
        properties: {
          id: { type: 'string', example: 'EVT-001-P001' },
          event_id: { type: 'string', example: 'EVT-001' },
          name: { type: 'string', example: 'Ana Pereira' },
          type: {
            type: 'string',
            enum: ['vip', 'normal'],
            description: 'vip = múltiplas entradas/saídas | normal = apenas 1 check-in',
          },
          status: {
            type: 'string',
            enum: ['inside', 'outside'],
            description: 'Posição atual do participante no evento',
          },
          checkin_count: {
            type: 'integer',
            minimum: 0,
            description: 'Número total de registros de entrada/saída',
            example: 4,
          },
        },
      },
      ParticipantPatch: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['inside', 'outside'] },
          checkin_count: { type: 'integer', minimum: 0 },
        },
      },
      Checkin: {
        type: 'object',
        required: ['id', 'event_id', 'participant_id', 'timestamp', 'success', 'action', 'error_reason'],
        properties: {
          id: { type: 'string', example: 'chk-abc123' },
          event_id: { type: 'string', example: 'EVT-001' },
          participant_id: { type: 'string', example: 'EVT-001-P001' },
          timestamp: { type: 'string', format: 'date-time', example: '2025-05-15T09:15:00.000Z' },
          success: { type: 'boolean', description: 'false quando há violação de regra de negócio' },
          action: { type: 'string', enum: ['entry', 'exit'] },
          error_reason: {
            type: 'string',
            nullable: true,
            enum: ['already_checked_in', 'event_closed', null],
            description: 'null em caso de sucesso',
          },
        },
      },
      CheckinPayload: {
        type: 'object',
        required: ['event_id', 'participant_id', 'timestamp', 'success', 'action', 'error_reason'],
        properties: {
          event_id: { type: 'string', example: 'EVT-001' },
          participant_id: { type: 'string', example: 'EVT-001-P001' },
          timestamp: { type: 'string', format: 'date-time' },
          success: { type: 'boolean' },
          action: { type: 'string', enum: ['entry', 'exit'] },
          error_reason: {
            type: 'string',
            nullable: true,
            enum: ['already_checked_in', 'event_closed', null],
          },
        },
      },
    },
  },
};

export default spec;
