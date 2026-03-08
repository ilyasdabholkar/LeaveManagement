FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app:create_app

WORKDIR /app

COPY Services/Leave.API/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Services/Leave.API/ .

EXPOSE 5555

CMD ["python", "app.py"]