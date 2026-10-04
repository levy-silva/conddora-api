ALTER TABLE "condominios" ADD COLUMN "cnpj" varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "condominios" ADD CONSTRAINT "condominios_cnpj_unique" UNIQUE("cnpj");