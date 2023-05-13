from myflaskapp import app

faible_app = app.create_app()

if __name__ == "__main__":
    faible_app.run(debug=True)
