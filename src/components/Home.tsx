import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useLessonStore } from '../store/useLessonStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { LESSON_01 } from '../data/lessonClassify';
import { LESSON_02 } from '../data/lesson02Verbs';
import { LESSON_03 } from '../data/lesson03Verbs';
import { VERB_STAGES } from '../data/verbLesson';
import { ImportExport } from './ImportExport';
import {
  BookOpen,
  Clock,
  Trophy,
  Folder,
  Plus,
  Download,
  Upload,
  Sparkles,
  Target,
  Calendar,
  ArrowRight,
  Check,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export function Home() {
  const {
    groups,
    cards,
    getGroupsWithReviewCount,
    getTotalCardsForReview,
    startPlayMode,
    addGroup,
    selectGroup,
    setViewMode,
  } = useStore();

  // Progresso da Aula 01 (classificação de frases)
  const lessonAnswers = useLessonStore((s) => s.progress[LESSON_01.id]?.answers);
  const lessonTotal = LESSON_01.questions.length;
  const lessonAnswered = lessonAnswers ? Object.keys(lessonAnswers).length : 0;
  const lessonCorrect = lessonAnswers
    ? LESSON_01.questions.filter((q) => lessonAnswers[q.id] === q.answer).length
    : 0;
  const lessonDone = lessonAnswered === lessonTotal;

  // Progresso das aulas de verbos
  const verbTotal = VERB_STAGES.length;
  const verb2StagesDone = useVerbLessonStore((s) => s.progress[LESSON_02.id]?.stagesDone);
  const verb2Done = verb2StagesDone ? verb2StagesDone.length : 0;
  const verb2Complete = verb2Done === verbTotal;
  const verb3StagesDone = useVerbLessonStore((s) => s.progress[LESSON_03.id]?.stagesDone);
  const verb3Done = verb3StagesDone ? verb3StagesDone.length : 0;
  const verb3Complete = verb3Done === verbTotal;

  const [showImportExport, setShowImportExport] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const groupsWithReview = getGroupsWithReviewCount();
  const totalReviewCount = getTotalCardsForReview();

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAddingGroup(false);
    }
  };

  // Calcular estatísticas
  const totalCards = cards.length;
  const avgLevelNum =
    totalCards > 0 ? cards.reduce((acc, c) => acc + c.level, 0) / totalCards : 0;
  const avgLevel = totalCards > 0 ? avgLevelNum.toFixed(1) : '0';
  const masteredCards = cards.filter((c) => c.level === 5).length;
  const masteredPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col">

        {/* KPIs — sistema de progresso, não dashboard administrativo */}
        <div
          className={`mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${
            totalReviewCount > 0 ? 'order-2 lg:order-2' : 'order-1 lg:order-1'
          }`}
        >
          <KpiCard
            icon={<BookOpen className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-cyan-50 text-cyan-600 ring-cyan-100"
            label="Total de Cards"
            value={totalCards}
            visual={
              totalCards > 0 ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-600">
                  <BookOpen className="h-3 w-3" /> biblioteca
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">
                  comece criando um grupo
                </span>
              )
            }
          />

          <KpiCard
            icon={<Clock className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-violet-50 text-violet-600 ring-violet-100"
            label="Para Revisar"
            value={totalReviewCount}
            valueColorClass={totalReviewCount > 0 ? 'text-violet-600' : 'text-slate-900'}
            visual={
              totalReviewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-violet-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
                  </span>
                  pronto agora
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <Check className="h-3 w-3" /> tudo em dia
                </span>
              )
            }
          />

          <KpiCard
            icon={<Target className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-violet-50 text-violet-600 ring-violet-100"
            label="Nível Médio"
            value={avgLevel}
            suffix={<span className="text-base font-medium text-slate-400">/ 5</span>}
            visual={<LevelDots value={avgLevelNum} />}
          />

          <KpiCard
            icon={<Trophy className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-emerald-50 text-emerald-600 ring-emerald-100"
            label="Dominados"
            value={masteredCards}
            valueColorClass={masteredCards > 0 ? 'text-emerald-600' : 'text-slate-900'}
            visual={<MasteryRatio pct={masteredPct} />}
          />
        </div>

        {/* AULA 01 — gancho para o exercício de classificação de frases */}
        <div
          className={`mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            totalReviewCount > 0 ? 'order-2 lg:order-2' : 'order-1 lg:order-1'
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode('lesson-classify')}
            className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_18px_36px_-12px_rgba(124,58,237,0.20)]"
          >
            {lessonDone && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluída
              </span>
            )}

            <div className="flex items-center gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105 ${
                  lessonDone
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                }`}
              >
                {lessonDone ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <GraduationCap className="h-6 w-6" strokeWidth={2.2} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900">
                    {LESSON_01.title}
                  </h3>
                  {!lessonDone && (
                    <ArrowRight className="h-4 w-4 text-violet-400 transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{LESSON_01.subtitle}</p>
              </div>
            </div>

            {/* Progresso */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="tabular-nums">
                  {lessonAnswered}/{lessonTotal} respondidas
                </span>
                {lessonAnswered > 0 && (
                  <span className="tabular-nums text-emerald-600">{lessonCorrect} acertos</span>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    lessonDone
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                  style={{ width: `${(lessonAnswered / lessonTotal) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-violet-600">
                {lessonDone
                  ? 'Ver resultado e revisão →'
                  : lessonAnswered > 0
                    ? 'Continuar exercício →'
                    : 'Começar exercício →'}
              </p>
            </div>
          </button>

          {/* Aula 02 — decorar os 25 verbos */}
          <button
            type="button"
            onClick={() => setViewMode('lesson-verbs')}
            className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_18px_36px_-12px_rgba(124,58,237,0.20)]"
          >
            {verb2Complete && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluída
              </span>
            )}

            <div className="flex items-center gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105 ${
                  verb2Complete
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                }`}
              >
                {verb2Complete ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <BookOpen className="h-6 w-6" strokeWidth={2.2} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900">
                    {LESSON_02.title}
                  </h3>
                  {!verb2Complete && (
                    <ArrowRight className="h-4 w-4 text-violet-400 transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{LESSON_02.subtitle}</p>
              </div>
            </div>

            {/* Progresso */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="tabular-nums">
                  {verb2Done}/{verbTotal} etapas
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    verb2Complete
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                  style={{ width: `${(verb2Done / verbTotal) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-violet-600">
                {verb2Complete
                  ? 'Revisar os verbos →'
                  : verb2Done > 0
                    ? 'Continuar decorando →'
                    : 'Começar a decorar →'}
              </p>
            </div>
          </button>

          {/* Aula 03 — verbos 26–50 */}
          <button
            type="button"
            onClick={() => setViewMode('lesson-verbs-3')}
            className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_18px_36px_-12px_rgba(124,58,237,0.20)]"
          >
            {verb3Complete && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluída
              </span>
            )}

            <div className="flex items-center gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105 ${
                  verb3Complete
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                }`}
              >
                {verb3Complete ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <BookOpen className="h-6 w-6" strokeWidth={2.2} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900">
                    {LESSON_03.title}
                  </h3>
                  {!verb3Complete && (
                    <ArrowRight className="h-4 w-4 text-violet-400 transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{LESSON_03.subtitle}</p>
              </div>
            </div>

            {/* Progresso */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="tabular-nums">
                  {verb3Done}/{verbTotal} etapas
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    verb3Complete
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                  style={{ width: `${(verb3Done / verbTotal) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-violet-600">
                {verb3Complete
                  ? 'Revisar os verbos →'
                  : verb3Done > 0
                    ? 'Continuar decorando →'
                    : 'Começar a decorar →'}
              </p>
            </div>
          </button>
        </div>

        {/* MEUS GRUPOS — mapa de evolução */}
        <div
          className={`mb-8 ${
            totalReviewCount > 0 ? 'order-3 lg:order-3' : 'order-2 lg:order-3'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100/80 ring-1 ring-slate-200/80">
                <Folder className="h-4 w-4 text-slate-600" strokeWidth={2.4} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Meus Grupos
                </h2>
                <p className="text-xs text-slate-500">
                  {groups.length} {groups.length === 1 ? 'coleção' : 'coleções'}
                  {totalCards > 0 && (
                    <>
                      <span className="text-slate-300"> · </span>
                      {totalCards} {totalCards === 1 ? 'card' : 'cards'} no total
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingGroup(true)}
              className="group flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:translate-y-0"
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
              Novo Grupo
            </button>
          </div>

          {/* Form novo grupo */}
          {isAddingGroup && (
            <div className="mb-4 animate-fade-in rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nome do grupo..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddGroup();
                    if (e.key === 'Escape') setIsAddingGroup(false);
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none sm:flex-none"
                  >
                    Criar
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingGroup(false);
                      setNewGroupName('');
                    }}
                    className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 sm:flex-none"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
              <div
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(124, 58, 237, 0.10)',
                }}
              >
                <Folder className="h-7 w-7 text-violet-500" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold tracking-tight text-slate-900">
                Comece sua biblioteca
              </h3>
              <p className="mx-auto mb-5 max-w-xs text-sm text-slate-500">
                Crie seu primeiro grupo para começar a adicionar flash cards e construir seu progresso.
              </p>
              <button
                onClick={() => setIsAddingGroup(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Grupo
              </button>
            </div>
          ) : (
            <div className="max-h-[min(320px,48vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent] md:max-h-[min(380px,52vh)] lg:max-h-[min(460px,55vh)]">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupsWithReview.map(({ group, reviewCount, totalCards: gTotal }, index) => {
                  const groupCards = cards.filter((c) => c.groupId === group.id);
                  const gAvg =
                    groupCards.length > 0
                      ? groupCards.reduce((a, c) => a + c.level, 0) / groupCards.length
                      : 0;
                  const gMastered = groupCards.filter((c) => c.level === 5).length;
                  const masteryPct = (gAvg / 5) * 100;
                  return (
                    <div
                      key={group.id}
                      className="group relative animate-fade-in overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_36px_-12px_rgba(124,58,237,0.20)]"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        boxShadow:
                          '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255, 255, 255, 1) inset',
                      }}
                    >
                      {/* Faixa colorida no topo (visível só no hover) */}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100"
                      />

                      {/* Área clicável: abre o grupo */}
                      <button
                        type="button"
                        onClick={() => selectGroup(group.id)}
                        className="block w-full text-left focus:outline-none"
                      >
                      <div className="mb-3.5 flex items-start justify-between gap-2">
                        <div
                          className="grid h-10 w-10 place-items-center rounded-xl transition-all duration-200 group-hover:scale-105"
                          style={{
                            background:
                              'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                            boxShadow: 'inset 0 0 0 1px rgba(8, 145, 178, 0.10)',
                          }}
                        >
                          <Folder
                            className="h-5 w-5 text-cyan-600 transition-colors group-hover:text-violet-600"
                            strokeWidth={2.2}
                          />
                        </div>

                        {reviewCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
                            </span>
                            {reviewCount} para revisar
                          </span>
                        ) : gTotal > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <Check className="h-3 w-3" />
                            Em dia
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-violet-900">
                        {group.name}
                      </h3>
                      <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium tabular-nums">{gTotal}</span>
                        <span>{gTotal === 1 ? 'card' : 'cards'}</span>
                        {gMastered > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="inline-flex items-center gap-0.5 font-medium text-emerald-600">
                              <Trophy className="h-3 w-3" strokeWidth={2.4} />
                              {gMastered}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Progress bar de domínio (avg level / 5) */}
                      {gTotal > 0 && (
                        <>
                          <div className="relative h-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                              style={{
                                width: `${masteryPct}%`,
                                background:
                                  'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                              }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-slate-400">
                            <span className="tabular-nums">
                              Nível {gAvg.toFixed(1)} / 5
                            </span>
                            <span className="flex items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-70">
                              Abrir
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </>
                      )}
                      </button>

                      {reviewCount > 0 && (
                        <button
                          type="button"
                          onClick={() => startPlayMode(group.id)}
                          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-500/25"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Revisar {reviewCount} {reviewCount === 1 ? 'card' : 'cards'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AÇÕES RÁPIDAS — mantidas, refinadas */}
        <div
          className={`grid gap-4 md:grid-cols-2 ${
            totalReviewCount > 0 ? 'order-4 lg:order-4' : 'order-3 lg:order-4'
          }`}
        >
          {/* Backup & Restauração */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.12)',
                }}
              >
                <Sparkles className="h-5 w-5 text-indigo-600" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Backup & Restauração
                </h3>
                <p className="text-xs text-slate-500">
                  Exporte ou importe seu progresso
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowImportExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <Download className="h-4 w-4" strokeWidth={2.2} />
                Exportar
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <Upload className="h-4 w-4" strokeWidth={2.2} />
                Importar
              </button>
            </div>
          </div>

          {/* Dica do dia */}
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background:
                'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 60%, #faf5ff 100%)',
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.04), inset 0 0 0 1px rgba(8, 145, 178, 0.10)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full opacity-50"
              style={{
                background:
                  'radial-gradient(circle, rgba(8, 145, 178, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-cyan-100">
                  <Calendar className="h-5 w-5 text-cyan-600" strokeWidth={2.2} />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-cyan-950">
                  Dica de Estudo
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-cyan-900/80">
                A revisão espaçada é mais eficiente que estudar muitas horas seguidas.{' '}
                <span className="font-semibold text-cyan-900">
                  Revise alguns minutos todo dia
                </span>{' '}
                — é assim que vocabulário fica retido pra valer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Import/Export */}
      {showImportExport && <ImportExport onClose={() => setShowImportExport(false)} />}
    </div>
  );
}

// =================================================================
// Subcomponentes — KPI premium
// =================================================================

interface KpiCardProps {
  icon: React.ReactNode;
  iconTint: string;
  label: string;
  value: number | string;
  valueColorClass?: string;
  suffix?: React.ReactNode;
  visual?: React.ReactNode;
}

function KpiCard({
  icon,
  iconTint,
  label,
  value,
  valueColorClass = 'text-slate-900',
  suffix,
  visual,
}: KpiCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.10)]"
      style={{
        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255, 255, 255, 1) inset',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${iconTint}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <p
          className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${valueColorClass}`}
        >
          {value}
        </p>
        {suffix}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {visual && <div className="flex shrink-0 items-center">{visual}</div>}
      </div>
    </div>
  );
}

/** 5 dots — preenchidos proporcional ao nível médio (0..5). */
function LevelDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => {
        const fill = Math.max(0, Math.min(1, value - (dot - 1)));
        return (
          <div
            key={dot}
            className="relative h-2 w-2 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-700"
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Mini-progress de domínio (% mastered). */
function MasteryRatio({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1.5 w-10 overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold tabular-nums text-emerald-600">
        {pct}%
      </span>
    </div>
  );
}
