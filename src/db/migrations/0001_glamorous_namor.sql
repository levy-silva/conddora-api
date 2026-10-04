CREATE TABLE "condominios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"razao_social" varchar(255) NOT NULL,
	"nome_fantasia" varchar(255) NOT NULL,
	"logradouro" varchar(255) NOT NULL,
	"bairro" varchar(255) NOT NULL,
	"numero" varchar(10),
	"complemento" varchar(255),
	"cep" varchar(8) NOT NULL,
	"uf" varchar(2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
