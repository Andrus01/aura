import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { renderInline } from "@/components/legal/LegalBlocks";
import { getI18n } from "@/lib/i18n/server";
import { company, legalVars } from "@/lib/company";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.legal.contact.title, description: dict.legal.contact.intro };
}

export default async function ContactPage() {
  const { dict, locale } = await getI18n();
  const p = dict.legal.contact;

  return (
    <LegalLayout dict={dict} locale={locale} title={p.title} intro={p.intro}>
      <h2>{p.supportH}</h2>
      {p.support.split("\n").map((line, i) => (
        <p key={i}>{renderInline(line, legalVars)}</p>
      ))}

      <h2>{p.companyH}</h2>
      <table>
        <tbody>
          <tr>
            <th>{p.rows.name}</th>
            <td>{company.legalName}</td>
          </tr>
          <tr>
            <th>{p.rows.reg}</th>
            <td>{company.regNr}</td>
          </tr>
          <tr>
            <th>{p.rows.address}</th>
            <td>{company.address}</td>
          </tr>
          <tr>
            <th>{p.rows.email}</th>
            <td>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </td>
          </tr>
          <tr>
            <th>{p.rows.phone}</th>
            <td>{company.phone}</td>
          </tr>
          <tr>
            <th>{p.rows.vat}</th>
            <td>{company.vatNote}</td>
          </tr>
        </tbody>
      </table>
    </LegalLayout>
  );
}
