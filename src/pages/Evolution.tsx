import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockMeasurements } from '@/data/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function Evolution() {
  const [searchParams] = useSearchParams();
  const preselectedStudent = searchParams.get('student');
  const [selectedStudent, setSelectedStudent] = useState(preselectedStudent || '1');
  const [metric, setMetric] = useState<'peso' | 'bf_percentual'>('peso');

  const student = mockStudents.find(s => s.id === selectedStudent);
  const measurements = mockMeasurements.filter(m => m.usuario_id === selectedStudent);

  const chartData = measurements.map(m => ({
    date: new Date(m.data_medicao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    peso: m.peso,
    bf_percentual: m.bf_percentual,
  }));

  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];

  const calculateChange = (first: number | undefined, last: number | undefined) => {
    if (!first || !last) return { value: 0, percentage: 0, trend: 'neutral' };
    const diff = last - first;
    const percentage = ((diff / first) * 100).toFixed(1);
    return {
      value: diff.toFixed(1),
      percentage,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
    };
  };

  const stats = [
    {
      label: 'Peso',
      current: lastMeasurement?.peso,
      unit: 'kg',
      change: calculateChange(firstMeasurement?.peso, lastMeasurement?.peso),
      goalTrend: student?.objetivo === 'Emagrecimento' ? 'down' : 'up'
    },
    {
      label: '% Gordura (BF)',
      current: lastMeasurement?.bf_percentual,
      unit: '%',
      change: calculateChange(firstMeasurement?.bf_percentual, lastMeasurement?.bf_percentual),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Evolução</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso dos seus alunos ao longo do tempo
          </p>
        </div>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecione o aluno" />
          </SelectTrigger>
          <SelectContent>
            {mockStudents.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Student Info */}
      {student && (
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl font-bold text-primary">
                {student.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{student.nome}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">{student.objetivo}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {measurements.length} avaliações
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {measurements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Este aluno ainda não possui avaliações registradas.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">
                    {stat.current}{stat.unit}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.change.trend, stat.goalTrend)}`}>
                    {getTrendIcon(stat.change.trend)}
                    <span>
                      {stat.change.trend === 'up' ? '+' : ''}{stat.change.value}{stat.unit}
                    </span>
                    <span className="text-muted-foreground">
                      ({stat.change.trend === 'up' ? '+' : ''}{stat.change.percentage}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Evolução ao Longo do Tempo</CardTitle>
                  <CardDescription>Visualize o progresso em peso e gordura corporal</CardDescription>
                </div>
                <Select value={metric} onValueChange={(v) => setMetric(v as typeof metric)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peso">Peso</SelectItem>
                    <SelectItem value="bf_percentual">% Gordura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={metric}
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Measurements History */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Avaliações</CardTitle>
              <CardDescription>Todas as medições registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Data</th>
                      <th className="pb-3 font-medium">Peso</th>
                      <th className="pb-3 font-medium">Altura</th>
                      <th className="pb-3 font-medium">% Gordura (BF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.slice().reverse().map((m) => (
                      <tr key={m.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">
                          {new Date(m.data_medicao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3">{m.peso} kg</td>
                        <td className="py-3">{m.altura} cm</td>
                        <td className="py-3">{m.bf_percentual}%</td>
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