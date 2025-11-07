import click
from backend.app import app, db
from backend.models.user import User
from sqlalchemy import text, inspect


@click.group()
def cli():
    pass


@cli.command()
def seed():
    with app.app_context():
        if not User.query.filter_by(email="admin@example.com").first():
            u = User(name="Admin", email="admin@example.com", role="admin")
            u.set_password("admin123")
            db.session.add(u)
            db.session.commit()
            click.echo("Seeded admin user: admin@example.com / admin123")
        else:
            click.echo("Admin already exists")


@cli.command()
def migrate_kyc():
    """Add missing verified_email column to kyc_documents table"""
    with app.app_context():
        try:
            engine = db.engine
            inspector = inspect(engine)
            
            # Check if kyc_documents table exists
            if "kyc_documents" not in inspector.get_table_names():
                click.echo("kyc_documents table does not exist. Creating tables...")
                db.create_all()
                click.echo("Tables created successfully.")
                return
            
            # Check existing columns
            with engine.connect() as conn:
                result = conn.execute(text("PRAGMA table_info(kyc_documents)"))
                kyc_cols = {row[1] for row in result}
                
                if "verified_email" not in kyc_cols:
                    click.echo("Adding verified_email column to kyc_documents table...")
                    conn.execute(text("ALTER TABLE kyc_documents ADD COLUMN verified_email VARCHAR(255)"))
                    conn.commit()
                    click.echo("✓ Successfully added verified_email column!")
                else:
                    click.echo("✓ verified_email column already exists in kyc_documents table.")
        except Exception as e:
            click.echo(f"Error: {e}", err=True)
            return


if __name__ == "__main__":
    cli()


