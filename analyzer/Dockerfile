FROM python:3.13-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN mkdir -p /app/models /opt/malscan/uploads/quarantine

ENV ANALYZER_MODEL_DIR=/app/models
ENV ANALYZER_UPLOAD_ROOT=/opt/malscan/uploads
ENV ANALYZER_MODEL_FILENAME=EMBER2024_PE.model
ENV ANALYZER_MALICIOUS_THRESHOLD=0.5

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
