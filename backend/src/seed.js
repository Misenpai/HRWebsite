// seedHRData.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedHRData = async () => {
  try {
    const hrData = [
      { username: "HRUser1", password: "123456" },
      { username: "HRUser2", password: "123456" },
      { username: "HRUser3", password: "123456" },
    ];

    await prisma.hR.createMany({
      data: hrData,
      skipDuplicates: true,
    });

    console.log(`✅ Seeded ${hrData.length} HRs successfully`);

    const hrPIAssignments = [
      { username: "HRUser1", pis: ["PIUser1"] },
      { username: "HRUser2", pis: ["PIUser2"] },
      { username: "HRUser3", pis: ["PIUser3"] },
    ];

    const hrPIRelations = [];
    for (const assignment of hrPIAssignments) {
      for (const piUsername of assignment.pis) {
        if (piUsername) {
          hrPIRelations.push({
            username: assignment.username,
            piUsername,
          });
        }
      }
    }

    if (hrPIRelations.length > 0) {
      await prisma.hRPIRelation.createMany({
        data: hrPIRelations,
        skipDuplicates: true,
      });

      console.log(
        `✅ Created ${hrPIRelations.length} HR-PI relations successfully`
      );
    }

    console.log("HR-PI Distribution:");
    hrPIAssignments.forEach((assignment) => {
      console.log(
        `  - ${assignment.username}: ${assignment.pis.length} PIs (${assignment.pis.join(", ")})`
      );
    });

    return {
      success: true,
      message: `HRs and relations seeded successfully`,
      count: hrData.length,
    };
  } catch (error) {
    console.error("❌ Error seeding HRs:", error);
    return {
      success: false,
      message: "Failed to seed HRs",
      error: error instanceof Error ? error.message : error,
    };
  } finally {
    await prisma.$disconnect();
  }
};

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedHRData();
}