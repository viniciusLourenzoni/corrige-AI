import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Essay } from "../types/essay";

const Dashboard = () => {
  const { user } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        const response = await api.get(
          user?.role === "student" ? `/essays/student/${user?.id}` : "/essays"
        );
        setEssays(response.data);
      } catch (error) {
        console.error("Falha ao buscar redações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, [user?.role, user?.id]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Bem-vindo(a), {user?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Você está logado como{" "}
              {user?.role === "student" ? "Aluno(a)" : "Professor(a)"}
            </p>
          </div>
          {user?.role === "student" && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                to="/essays/create"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Criar Nova Redação
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500">
              Carregando...
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {essays.map((essay) => (
                <li key={essay.id}>
                  <Link
                    to={`/essays/${essay.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {essay.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              essay.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {essay.status === "pending"
                              ? "Pendente"
                              : "Corrigida"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Criada em{" "}
                            {new Date(essay.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
