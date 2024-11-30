import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Essay, Correction } from "../types/essay";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";

const EssayDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number>(0);
  const [useAI, setUseAI] = useState<boolean>(false);

  useEffect(() => {
    const fetchEssayDetails = async () => {
      try {
        const [essayResponse, correctionResponse] = await Promise.all([
          api.get(`/essays/${id}`),
          api.get(`/corrections/essay/${id}`),
        ]);
        setEssay(essayResponse.data);
        setCorrection(correctionResponse.data);

        if (correctionResponse.data) {
          setFeedback(correctionResponse.data.aiFeedback?.feedback || "");
          setScore(correctionResponse.data.aiFeedback?.score || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar os detalhes da redação:", error);
        toast.error("Não foi possível carregar os detalhes da redação.");
      } finally {
        setLoading(false);
      }
    };

    fetchEssayDetails();
  }, [id]);

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!correction) {
        const response = useAI
          ? await api.post(`/corrections/ai`, {
              essayId: id,
              teacherId: user?.id,
            })
          : await api.post(`/corrections`, {
              essayId: id,
              teacherId: user?.id,
              feedback,
              score,
            });
        setCorrection(response.data);
        toast.success(
          useAI ? "Correção gerada com IA!" : "Correção manual criada!"
        );
      } else {
        const response = await api.patch(`/corrections/${correction.id}/text`, {
          correctionText: feedback,
        });
        setCorrection(response.data);
        toast.success("Correção atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar a correção:", error);
      toast.error("Falha ao salvar a correção.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Carregando...</div>
      </Layout>
    );
  }

  if (!essay) {
    return (
      <Layout>
        <div className="text-center py-12">Redação não encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="mr-2" />
          </button>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold">{essay.title}</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enviada em {new Date(essay.createdAt).toLocaleDateString()}
            </p>
            <span
              className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  essay.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
            >
              {essay.status === "pending" ? "Pendente" : "Corrigida"}
            </span>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{essay.content}</p>
          </div>

          {user?.role === "teacher" && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="correctionType"
                    value="manual"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={!useAI}
                    onChange={() => setUseAI(false)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Correção Manual
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="correctionType"
                    value="ai"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={useAI}
                    onChange={() => setUseAI(true)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Correção com IA
                  </span>
                </label>
              </div>
              <form onSubmit={handleSubmitCorrection}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="score"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nota (0-10)
                    </label>
                    <input
                      type="number"
                      id="score"
                      min="0"
                      max="10"
                      className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || feedback.length < 10}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Enviar Feedback
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EssayDetails;
