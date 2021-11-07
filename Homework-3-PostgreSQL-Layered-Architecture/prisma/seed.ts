import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            { login: 'yatoro_g', password: 'c23VMvETTw', age: 12 },
            { login: 'alohadance', password: '6u9tJC9vwD', age: 23 },
            { login: 'sh4doweh', password: 's55euBEy2w', age: 26 },
            { login: 'magical', password: 'utE2PG8544', age: 45 },
            { login: 'arteezy', password: 'NR6dfdRT9Q', age: 83 },
            { login: 'illidan_str', password: 'u4vGCkB7a7', age: 71 },
            { login: 'BananaSlamJamma', password: 'zBg5TejF2y', age: 50 },
            { login: 'qSnake', password: 'e38WBg9Gfw', age: 37 },
            { login: 'Sneyking', password: 'cWj94uUF2r', age: 99 }
        ]
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
