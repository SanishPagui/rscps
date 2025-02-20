"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = defaultIcon

interface Ride {
  id: number
  driver: string
  pickup: [number, number] // [latitude, longitude]
}

// Center coordinates (New York City)
const center: [number, number] = [40.7128, -74.006]

function RouteLayer({ pickup, dropoff }: { pickup: [number, number] | null; dropoff: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (pickup && dropoff) {
      // Create a line between pickup and dropoff
      const line = L.polyline([pickup, dropoff], { color: 'blue', weight: 3 })
      line.addTo(map)
      
      // Fit bounds to show the entire route
      map.fitBounds([pickup, dropoff])

      return () => {
        map.removeLayer(line)
      }
    }
  }, [map, pickup, dropoff])

  return null
}

export default function RideMatchingMap() {
  const [pickup, setPickup] = useState<[number, number] | null>(null)
  const [dropoff, setDropoff] = useState<[number, number] | null>(null)
  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")
  const [availableRides, setAvailableRides] = useState<Ride[]>([])

  // Geocoding function using Nominatim
  async function geocodeAddress(address: string): Promise<[number, number] | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      )
      const data = await response.json()
      if (data && data[0]) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  async function findRoute() {
    if (!pickupAddress || !dropoffAddress) return

    const pickupCoords = await geocodeAddress(pickupAddress)
    const dropoffCoords = await geocodeAddress(dropoffAddress)

    if (pickupCoords && dropoffCoords) {
      setPickup(pickupCoords)
      setDropoff(dropoffCoords)
    }
  }

  useEffect(() => {
    // Mock real-time updates of available rides
    const interval = setInterval(() => {
      const newRide: Ride = {
        id: Math.random(),
        driver: `Driver ${Math.floor(Math.random() * 100)}`,
        pickup: [
          center[0] + (Math.random() - 0.5) * 0.1,
          center[1] + (Math.random() - 0.5) * 0.1,
        ],
      }
      setAvailableRides((prev) => [...prev.slice(-4), newRide]) // Keep last 5 rides
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/3 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pickup">Pickup Location</Label>
          <Input
            id="pickup"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter pickup location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dropoff">Drop-off Location</Label>
          <Input
            id="dropoff"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            placeholder="Enter drop-off location"
          />
        </div>
      </div>
      <div className="w-full md:w-2/3 h-[600px]">
      <MapContainer
        center={[15.3630, 74.0252]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker position={[15.3630, 74.0252]}>
        </Marker> */}
        {pickup && dropoff && (
          <RouteLayer pickup={pickup} dropoff={dropoff} />
        )}
      </MapContainer>
      </div>
    </div>
  )
}