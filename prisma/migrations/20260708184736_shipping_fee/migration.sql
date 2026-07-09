-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL DEFAULT 'courier',
    "comments" TEXT,
    "subtotalCents" INTEGER NOT NULL,
    "shippingCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL DEFAULT 'demo',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL DEFAULT 'demo',
    "paymentProvider" TEXT,
    "montonioUuid" TEXT,
    "shippingCarrier" TEXT,
    "shippingMethodType" TEXT,
    "pickupPointId" TEXT,
    "pickupPointName" TEXT,
    "shipmentStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("comments", "createdAt", "currency", "customerName", "deliveryMethod", "email", "id", "montonioUuid", "paymentMethod", "paymentProvider", "paymentStatus", "phone", "pickupPointId", "pickupPointName", "reference", "shipmentStatus", "shippingCarrier", "shippingMethodType", "status", "subtotalCents") SELECT "comments", "createdAt", "currency", "customerName", "deliveryMethod", "email", "id", "montonioUuid", "paymentMethod", "paymentProvider", "paymentStatus", "phone", "pickupPointId", "pickupPointName", "reference", "shipmentStatus", "shippingCarrier", "shippingMethodType", "status", "subtotalCents" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
