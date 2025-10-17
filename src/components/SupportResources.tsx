import { motion } from "framer-motion";
import { Phone, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SupportResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  url?: string;
  description: string;
}

interface SupportResourcesProps {
  resources: SupportResource[];
  language?: "fr-FR" | "en-US";
}

export function SupportResources({ resources, language = "fr-FR" }: SupportResourcesProps) {
  if (!resources || resources.length === 0) return null;

  const isFr = language === "fr-FR";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mt-6"
    >
      <Card className="border-red-200 bg-red-50/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg text-red-900">
              {isFr ? "Ressources d'aide disponibles" : "Support resources available"}
            </CardTitle>
          </div>
          <CardDescription className="text-red-700">
            {isFr 
              ? "N'hésitez pas à contacter ces ressources si vous en ressentez le besoin."
              : "Don't hesitate to contact these resources if you need support."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg p-3 border border-red-100 shadow-sm"
            >
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {resource.name}
              </h4>
              <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
              
              <div className="flex gap-2">
                {resource.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={`tel:${resource.phone}`}>
                      <Phone className="h-3 w-3 mr-1" />
                      {resource.phone}
                    </a>
                  </Button>
                )}
                
                {resource.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {isFr ? "Site web" : "Website"}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
