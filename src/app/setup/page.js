// src/app/setup/page.js
import { prisma } from "../lib/prisma"; // Eğer hata verirse "../../lib/prisma" dene
import bcrypt from "bcryptjs";

export default async function SetupPage() {
  // Şifre: 123456
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. KURUMSAL FİRMA
  await prisma.user.upsert({
    where: { email: "firma@civildai.com" },
    update: { role: 'COMPANY', name: 'Civildai İnşaat A.Ş.', profession: null },
    create: { email: "firma@civildai.com", name: 'Civildai İnşaat A.Ş.', password: hashedPassword, role: 'COMPANY' }
  });

  // 2. PROFESYONEL (Mimar/Mühendis)
  await prisma.user.upsert({
    where: { email: "mimar@civildai.com" },
    update: { role: 'PROFESSIONAL', name: 'Mimar Sinan', profession: 'Yüksek Mimar' },
    create: { email: "mimar@civildai.com", name: 'Mimar Sinan', password: hashedPassword, role: 'PROFESSIONAL', profession: 'Yüksek Mimar' }
  });

  // 3. PROFESYONEL (Usta)
  await prisma.user.upsert({
    where: { email: "usta@civildai.com" },
    update: { role: 'PROFESSIONAL', name: 'Mehmet Usta', profession: 'Seramik Ustası' },
    create: { email: "usta@civildai.com", name: 'Mehmet Usta', password: hashedPassword, role: 'PROFESSIONAL', profession: 'Seramik Ustası' }
  });

  // 4. BİREYSEL KULLANICI
  await prisma.user.upsert({
    where: { email: "bireysel@civildai.com" },
    update: { role: 'INDIVIDUAL', name: 'Ahmet Yılmaz', profession: null },
    create: { email: "bireysel@civildai.com", name: 'Ahmet Yılmaz', password: hashedPassword, role: 'INDIVIDUAL' }
  });

  return (
    <div className="p-10 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Kullanıcılar Oluşturuldu! ✅</h1>
      <p className="mb-4 text-gray-700">Aşağıdaki hesaplarla giriş yapıp sistemi test edebilirsin (Şifre hepsinde: <b>123456</b>):</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-800">🏢 Kurumsal</h3>
            <p>Email: <b>firma@civildai.com</b></p>
            <p className="text-sm text-gray-500">İlan verebilir.</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800">👷‍♂️ Profesyonel (Mimar/Usta)</h3>
            <p>Email: <b>mimar@civildai.com</b> veya <b>usta@civildai.com</b></p>
            <p className="text-sm text-gray-500">İş arar, mesleği görünür.</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-gray-800">👤 Bireysel</h3>
            <p>Email: <b>bireysel@civildai.com</b></p>
            <p className="text-sm text-gray-500">Standart kullanıcı.</p>
        </div>
      </div>
    </div>
  );
}