import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Hooks
import { useStudents } from '@/hooks/api/useStudents'; // Assumindo que este hook existe
import { useStudentMeasurements } from '@/hooks/api/useMeasurements'; // O hook que você forneceu

export default function Evolution() {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedStudent = searchParams.get('student');
  
  // Estado local
  const [selectedStudentId, setSelectedStudentId] = useState<string>(preselectedStudent || '');
  const [metric, setMetric] = useState<'peso' | 'bf_percentual'>('peso');

  // 1. Busca lista de alunos (para o Dropdown)
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();

  // 2. Busca medições do aluno selecionado usando SEU HOOK
  const { 
    data: rawMeasurements = [], 
    isLoading: isLoadingMeasurements 
  } = useStudentMeasurements(selectedStudentId || undefined);

  // Sincroniza o param da URL com o estado local (ex: quando navega de StudentDetail)
  useEffect(() => {
    const paramStudent = searchParams.get('student');
    if (paramStudent && paramStudent !== selectedStudentId) {
      setSelectedStudentId(paramStudent);
    }
  }, [searchParams]);

  // Seleciona o primeiro aluno automaticamente se nenhum estiver na URL
  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      const firstId = students[0].id;
      setSelectedStudentId(firstId);
      setSearchParams({ student: firstId }, { replace: true });
    }
  }, [students, selectedStudentId, setSearchParams]);

  // Encontra os dados do aluno atual (para exibir nome/objetivo no header)
  const currentStudent = students.find(s => s.id === selectedStudentId);

  // 3. Processamento dos Dados (Memoizado para não recalcular a cada render)
  const processedData = useMemo(() => {
    if (!rawMeasurements) return { sortedMeasurements: [], chartData: [], first: null, last: null };

    // Ordenar por data (API pode vir desordenada)
    const sorted = [...rawMeasurements].sort((a, b) => 
      new Date(a.data_medicao).getTime() - new Date(b.data_medicao).getTime()
    );

    const chartData = sorted.map(m => ({
      date: new Date(m.data_medicao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      fullDate: new Date(m.data_medicao).toLocaleDateString('pt-BR'),
      peso: Number(m.peso),
      bf_percentual: m.bf_percentual ? Number(m.bf_percentual) : null,
    }));

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    return { sortedMeasurements: sorted, chartData, first, last };
  }, [rawMeasurements]);

  const { sortedMeasurements, chartData, first, last } = processedData;

  // Função auxiliar para calcular variação
  const calculateChange = (firstVal: number | undefined, lastVal: number | undefined) => {
    if (firstVal === undefined || lastVal === undefined) return { value: 0, percentage: 0, trend: 'neutral' };
    
    const diff = lastVal - firstVal;
    const percentage = firstVal !== 0 ? ((diff / firstVal) * 100).toFixed(1) : '0';
    
    return {
      value: diff.toFixed(1),
      percentage,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
    };
  };

  // Configuração dos Cards de Estatísticas
  const stats = [
    {
      label: 'Peso',
      current: last?.peso,
      unit: 'kg',
      change: calculateChange(first?.peso, last?.peso),
      // Se o objetivo for emagrecer, 'down' é verde. Se for hipertrofia, 'up' é verde.
      goalTrend: currentStudent?.objetivo?.toLowerCase().includes('emagrecimento') ? 'down' : 'up'
    },
    {
      label: '% Gordura (BF)',
      current: last?.bf_percentual,
      unit: '%',
      change: calculateChange(first?.bf_percentual, last?.bf_percentual),
      goalTrend: 'down'
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (trend: string, goalTrend: string) => {
    if (trend === 'neutral') return 'text-muted-foreground';
    if (trend === goalTrend) return 'text-green-600';
    return 'text-red-600';
  };

  // Loading Inicial
  if (isLoadingStudents && !selectedStudentId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header e Seleção */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Evolução</h1>
          <p className="text-muted-foreground">Acompanhe o progresso físico dos alunos</p>
        </div>
        
        <Select 
          value={selectedStudentId} 
          onValueChange={(val) => {
            setSelectedStudentId(val);
            setSearchParams({ student: val });
          }}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Selecione o aluno" />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info do Aluno */}
      {currentStudent && (
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <span className="text-lg font-bold text-primary">
                {currentStudent.nome.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{currentStudent.nome}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">{currentStudent.objetivo}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {isLoadingMeasurements ? '...' : rawMeasurements?.length || 0} avaliações
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo Principal */}
      {isLoadingMeasurements ? (
         <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      ) : sortedMeasurements.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Este aluno ainda não possui avaliações registradas.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cards de KPIs */}
          <div className="grid gap-4 md:grid-cols-2">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">
                    {stat.current !== undefined ? stat.current : '-'}{stat.unit}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stat.current !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.change.trend, stat.goalTrend)}`}>
                      {getTrendIcon(stat.change.trend)}
                      <span>
                        {stat.change.trend === 'up' ? '+' : ''}{stat.change.value}{stat.unit}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ({stat.change.trend === 'up' ? '+' : ''}{stat.change.percentage}%)
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">Total</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Gráfico de Evolução</CardTitle>
                  <CardDescription>Histórico de progresso</CardDescription>
                </div>
                <Select value={metric} onValueChange={(v) => setMetric(v as typeof metric)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peso">Peso (kg)</SelectItem>
                    <SelectItem value="bf_percentual">% Gordura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                      tickMargin={10}
                    />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: '0.5rem'
                      }}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                    />
                    <Line
                      type="monotone"
                      dataKey={metric}
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b text-left">
                      <th className="h-10 px-4 font-medium text-muted-foreground">Data</th>
                      <th className="h-10 px-4 font-medium text-muted-foreground">Peso</th>
                      <th className="h-10 px-4 font-medium text-muted-foreground">Altura</th>
                      <th className="h-10 px-4 font-medium text-muted-foreground">Gordura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sortedMeasurements].reverse().map((m) => (
                      <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">
                          {new Date(m.data_medicao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">{m.peso} kg</td>
                        <td className="p-4">{m.altura} M</td>
                        <td className="p-4">{m.bf_percentual ? `${m.bf_percentual}%` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}