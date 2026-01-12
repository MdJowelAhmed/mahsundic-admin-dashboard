import {
  User,
  Mail,
  Phone,
  MapPin,
  
} from "lucide-react";
import { ModalWrapper } from "@/components/common";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Client } from "@/types";

interface ViewClientDetailsModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ViewClientDetailsModal({
  open,
  onClose,
  client,
}: ViewClientDetailsModalProps) {
  if (!client) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Client Details"
      size="lg"
      className="max-w-2xl bg-white"
    >
      <div className="space-y-6">
        {/* Client Profile Section */}
        <div className="flex flex-col items-center text-center pb-6 border-b">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback className="text-2xl">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {client.name}
          </h2>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Contact Information
          </h3>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{client.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">{client.phone}</p>
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Country</p>
                    <p className="font-medium text-gray-900">
                      {client.country}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="font-medium text-gray-900">
                      {client.gender || "N/A"}
                    </p>
                  </div>
                </div>



       
                
            
              </div>

              <div className="flex items-center gap-2 mt-6">
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Full Address</p>
                    <p className="font-medium text-gray-900">
                      {client.fullAddress || "N/A"}
                    </p>
                  </div>
                </div>
            </CardContent>
          </Card>

     
        </div>

        <Separator />

        {/* Account Information */}
        <div>
          {/* License Information */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* License Number */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">License Number</p>
                    <p className="font-medium text-gray-900">
                      {client.licenseNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Document (Image/PDF proof) */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 mb-2">License Document</p>
                {client.licenseDocumentUrl ? (
                  client.licenseDocumentUrl.toLowerCase().endsWith(".pdf") ? (
                    <a
                      href={client.licenseDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View License PDF
                    </a>
                  ) : (
                    <a
                      href={client.licenseDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={client.licenseDocumentUrl}
                        alt="License Document"
                        className="w-full max-h-40 object-contain rounded-md border border-gray-200"
                      />
                    </a>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    No license document uploaded.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </ModalWrapper>
  );
}
