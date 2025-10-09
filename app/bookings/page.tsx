import React from "react"
import Header from "../_components/header"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import BookingItem from "../_components/booking-item"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    // Ou mostrar a tela de login
    return <div>Você precisa estar logado para ver seus agendamentos.</div>
  }

  const confirmedBookings = session?.user
    ? await db.booking.findMany({
        where: { userId: (session.user as any).id, date: { gt: new Date() } },
        include: {
          service: {
            include: { barbershop: true },
          },
        },
        orderBy: { date: "asc" },
      })
    : []
  const concludedBookings = session?.user
    ? await db.booking.findMany({
        where: { userId: (session.user as any).id, date: { lte: new Date() } },
        include: {
          service: {
            include: { barbershop: true },
          },
        },
        orderBy: { date: "asc" },
      })
    : []

  return (
    <div>
      <Header />
      <div className="space-y-3 p-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Confirmados
        </h2>
        {confirmedBookings.length > 0 ? (
          confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum agendamento confirmado.</p>
        )}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Finalizados
        </h2>
        {concludedBookings.length > 0 ? (
          concludedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum agendamento finalizado.</p>
        )}
      </div>
    </div>
  )
}

export default Bookings
