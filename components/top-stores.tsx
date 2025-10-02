import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

export function TopStores() {
  const stores = [
    {
      id: 1,
      name: "The Golden Spoon",
      category: "Restaurant",
      rating: 4.9,
      reviews: 234,
      location: "Downtown",
      image: "/cozy-italian-restaurant.png",
    },
    {
      id: 2,
      name: "TechHub Electronics",
      category: "Electronics",
      rating: 4.8,
      reviews: 189,
      location: "Mall District",
      image: "/electronics-store-interior.png",
    },
    {
      id: 3,
      name: "Cozy Corner Cafe",
      category: "Cafe",
      rating: 4.7,
      reviews: 156,
      location: "University Area",
      image: "/cozy-corner-cafe.png",
    },
    {
      id: 4,
      name: "Fashion Forward",
      category: "Clothing",
      rating: 4.6,
      reviews: 143,
      location: "Shopping Center",
      image: "/clothing-store.png",
    },
    {
      id: 5,
      name: "Green Garden Nursery",
      category: "Garden Center",
      rating: 4.5,
      reviews: 98,
      location: "Suburbs",
      image: "/garden-center.png",
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Top Rated Stores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={store.image || "/placeholder.svg"}
                    alt={store.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -left-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-card-foreground truncate">{store.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-card-foreground">{store.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {store.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {store.location}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{store.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
